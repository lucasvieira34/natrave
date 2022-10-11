import { useLocalStorage } from "react-use";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const validationSchema = yup.object().shape({
  homeTeamScore: yup.string().required(),
  awayTeamScore: yup.string().required(),
});

export const Card = ({
  gameId,
  homeTeam,
  awayTeam,
  gameTime,
  homeTeamScore,
  awayTeamScore,
  disabled,
  hunches,
  onHunchesChange,
}: any) => {
  const [auth]: any = useLocalStorage("auth", {});

  const formik = useFormik({
    onSubmit: async (values) => {
      await axios({
        method: "POST",
        baseURL: import.meta.env.VITE_API_URL,
        url: "/hunches",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        data: {
          ...values,
          gameId,
        },
      }).then((response) => {
        hunches.hunches.push(response.data);
        onHunchesChange(hunches);
      });
    },
    initialValues: {
      homeTeamScore,
      awayTeamScore,
    },
    validationSchema,
  });

  return (
    <div className="rounded-xl border border-gray-300 p-4 text-center space-y-4">
      <span className="text-sm md:text-base text-gray-700 font-bold">{gameTime}</span>

      <form className="flex space-x-3 md:space-x-4 justify-center items-center">
        <span className="uppercase">{homeTeam}</span>
        <img src={`src/assets/flags/${homeTeam}.png`} className="w-[45px] md:w-[55px]" />
        <input
          type="number"
          className="rounded-full bg-red-300/[0.2] w-[45px] h-[45px] md:w-[55px] md:h-[55px] text-red-700 text-xl text-center"
          name="homeTeamScore"
          value={formik.values.homeTeamScore}
          onChange={formik.handleChange}
          onBlur={formik.handleSubmit}
          disabled={disabled}
        />
        <span className="text-red-500 font-bold">X</span>
        <input
          type="number"
          className="rounded-full bg-red-300/[0.2] w-[45px] h-[45px] md:w-[55px] md:h-[55px] text-red-700 text-xl text-center"
          name="awayTeamScore"
          value={formik.values.awayTeamScore}
          onChange={formik.handleChange}
          onBlur={formik.handleSubmit}
          disabled={disabled}
        />

        <img src={`src/assets/flags/${awayTeam}.png`} className="w-[45px] md:w-[55px]" />
        <span className="uppercase">{awayTeam}</span>
      </form>
    </div>
  );
};
