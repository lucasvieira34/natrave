import { Navigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { formatISO, format } from "date-fns";
import { useEffect, useState } from "react";
import { DateSelect } from "../components/DateSelect";
import { Games } from "../models/Games";
import { HunchesModel } from "../models/HunchesModel";
import { Card } from "../components/Card";
import axios from "axios";
import { Spinner } from "../components/Spinner";

export const Dashboard = () => {
  const [auth]: any = useLocalStorage("auth", {});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentDate, setCurrentDate] = useState(formatISO(new Date(2022, 10, 20)));
  const [games, setGames] = useState<Games[]>([]);
  const [hunches, setHunches] = useState<HunchesModel>({ name: "", hunches: [] });
  const [hunchesMap, setHunchesMap] = useState<any>(undefined);

  if (!auth?.user?.id) {
    return <Navigate to="/" replace={true} />;
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/games?gameTime=${currentDate}`)
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message);
      });
  }, [currentDate]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/hunches/${auth.user.username}`)
      .then((response) => {
        setHunches(response.data);
        const hunchesMap = response.data.hunches.reduce((acc: any, hunch: any) => {
          acc[hunch.gameId] = hunch;
          return acc;
        }, {});
        const result = { ...response.data, hunches: hunchesMap };
        setHunchesMap(result);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message);
        setIsLoading(false);
      });
  }, []);

  const handleHunchesChange = (hunches: HunchesModel) => {
    setHunches(hunches);
    const updatedHunchesMap = hunches.hunches.reduce((acc: any, hunch: any) => {
      acc[hunch.gameId] = hunch;
      return acc;
    }, {});
    const result = { ...hunches, hunches: updatedHunchesMap };
    setHunchesMap(result);
  };

  const isDone = !isLoading && !errorMessage;

  return (
    <>
      <header className="bg-red-500 text-white">
        <div className="container max-w-3xl flex justify-between p-4">
          <img src="src/assets/logo-fundo-vermelho.svg" className="w-28 md:w-40" />
          <a href={`/${auth.user.username}`}>
            <img src="/src/assets/profile.svg" className="w-10" />
          </a>
        </div>
      </header>

      <main className="space-y-6">
        <section id="header" className="bg-red-500 text-white p-4">
          <div className="container max-w-3xl space-y-2">
            <span>Olá {auth.user.name}</span>
            <h3 className="text-2xl font-bold">Qual é o seu palpite?</h3>
          </div>
        </section>

        <section id="content" className="container max-w-3xl p-4 space-y-4">
          <DateSelect currentDate={currentDate} onDateChange={setCurrentDate} />
          <div className="space-y-4">
            {isLoading && <Spinner width={10} height={10} message="Carregando Jogos..." flex="col" />}
            {errorMessage ? (
              <span className="flex justify-center text-sm text-red-300">Ops! Algo deu errado. - {errorMessage}</span>
            ) : (
              ""
            )}

            {isDone &&
              games.map((game: any) => (
                <Card
                  key={game.id}
                  gameId={game.id}
                  homeTeam={game.homeTeam}
                  awayTeam={game.awayTeam}
                  gameTime={format(new Date(game.gameTime), "H:mm")}
                  homeTeamScore={hunchesMap?.hunches?.[game.id]?.homeTeamScore}
                  awayTeamScore={hunchesMap?.hunches?.[game.id]?.awayTeamScore}
                  hunches={hunches}
                  onHunchesChange={handleHunchesChange}
                />
              ))}
          </div>
        </section>
      </main>
    </>
  );
};
