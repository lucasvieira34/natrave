import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/Input";
import { useLocalStorage } from "react-use";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Spinner } from "../components/Spinner";

const validationSchema = yup.object().shape({
  email: yup.string().email("Informe um e-mail válido.").required("Informe seu e-mail."),
  password: yup.string().required("Digite uma senha."),
});

export const Login = () => {
  const [auth, setAuth]: any = useLocalStorage("auth", {});
  const [errorMessage, setErrorMessage] = useState("");
  const formik = useFormik({
    onSubmit: async (values) => {
      await axios({
        method: "GET",
        baseURL: import.meta.env.VITE_API_URL,
        url: "/login",
        auth: {
          username: values.email,
          password: values.password,
        },
      })
        .then((response) => {
          setAuth(response.data);
          return <Navigate to="/dashboard" replace={true} />;
        })
        .catch((error) => {
          setErrorMessage(error.response?.data?.message);
        });
    },
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
  });

  if (auth?.user?.id) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return (
    <div>
      <header className="p-4 border-b border-red-300">
        <div className="container max-w-xl flex justify-center">
          <img src="src/assets/logo-fundo-branco.svg" className="w-32 md:w-40" />
        </div>
      </header>

      <main className="container max-w-2xl p-4">
        <div className="p-4 flex space-x-4 items-center">
          <a href="/">
            <img src="/src/assets/back.svg" className="h-6" />
          </a>
          <h2 className="text-xl font-bold">Entre na sua conta</h2>
        </div>

        <form className="p-4 space-y-6" onSubmit={formik.handleSubmit}>
          <Input
            type="text"
            name="email"
            label="Seu email"
            placeholder="Digite seu e-mail"
            error={formik.touched.email && formik.errors.email}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Input
            type="password"
            name="password"
            label="Sua senha"
            placeholder="Digite sua senha"
            error={formik.touched.password && formik.errors.password}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <button
            type="submit"
            className="w-full text-center text-white bg-red-500 px-6 py-3 rounded-xl disabled:opacity-50"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? <Spinner width={6} height={6} flex="row" /> : "Entrar"}
          </button>
        </form>
        {errorMessage ? <span className="flex justify-center text-sm text-red-300">{errorMessage}</span> : ""}
      </main>
    </div>
  );
};
