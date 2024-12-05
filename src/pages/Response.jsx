import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Categorize from "../components/response/Categorize.jsx";
import Cloze from "../components/response/Cloze.jsx";
import Comprehension from "../components/response/Comprehension.jsx";

import { axiosOpen } from "../utils/axios.js";

const Response = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(true);
  const { data } = useQuery({
    queryKey: ["response", responseId],
    queryFn: async () => {
      const { data } = await axiosOpen.get(
        `/respondents/response/${responseId}`
      );
      setQuery(false);

      let answersObj = {};
      data?.data?.answers?.forEach(
        (answer) => (answersObj[answer._id] = answer.answer)
      );

      const questions = data?.questions?.map((que, i) => ({
        ...que,
        scored:
          data?.data?.answers &&
          data?.data?.answers[i] &&
          data?.data?.answers[i]?.scored
            ? data?.data?.answers[i]?.scored
            : 0,
      }));

      return {
        response: data?.data,
        form: data?.form,
        questions,
        answerObj: answersObj,
      };
    },
    enabled: query,
  });

  return (
    <section className="p-10 pt-7 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-end border-b border-solid border-b-neutral-300 p-1">
        <h2 className="font-extrabold text-2xl">Response</h2>
        <div>
          <button
            className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg font-bold"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="max-w-4xl mx-auto p-3">
          <div className="text-xl font-extrabold">Respondent Info:</div>
          <div className="text-xl font-bold mt-2">
            Name: {data?.response?.name}
          </div>
          <div className="text-xl font-bold mt-2">
            Email: {data?.response?.email}
          </div>
        </div>

        <hr className="mt-2 border-neutral-300" />

        <div className="font-bold text-3xl text-center underline">
          {data?.form?.formName}
        </div>

        {data?.form?.headerImage && (
          <div className="h-56 mt-2">
            <img
              src={data?.form?.headerImage}
              alt="headerImage"
              className="w-full h-full rounded-md object-contain"
            />
          </div>
        )}

        <hr className="mt-2 border-neutral-300" />

        <div className="mt-2">
          {data?.questions?.map((question, index) => (
            <div
              key={question._id}
              className="max-w-4xl mx-auto bg-white rounded-xl mt-2 p-3 shadow-md"
            >
              {question?.type === "categorize" ? (
                <Categorize
                  index={index}
                  data={question}
                  answer={data?.answerObj[question._id]}
                />
              ) : question?.type === "cloze" ? (
                <Cloze
                  index={index}
                  data={question}
                  answer={data?.answerObj[question._id]}
                />
              ) : question?.type === "comprehension" ? (
                <Comprehension
                  index={index}
                  data={question}
                  answer={data?.answerObj[question._id]}
                />
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Response;
