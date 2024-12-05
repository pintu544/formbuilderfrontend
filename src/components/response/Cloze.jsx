/* eslint-disable react/prop-types */

const Cloze = ({ index, data, answer }) => {
  const sentenceArray = data?.sentenceWithBlanks
    ?.replace(/<u>.*?<\/u>/g, "___________________")
    ?.split("___________________");

  const options = data?.options?.filter((opt) => !answer.includes(opt));

  return (
    <div>
      <div className="flex justify-between">
        <div className="font-semibold">Question {index + 1}</div>
        <div className="font-medium">Cloze</div>
        <div className="font-medium">
          Scored: {data?.scored}/{data?.points}
        </div>
      </div>

      {data?.imageUrl && (
        <div className="flex justify-center mt-3">
          <div className="w-[min(500px,100%)]">
            <img
              src={data?.imageUrl}
              className="w-full max-h-52 object-contain"
            />
          </div>
        </div>
      )}

      <div>
        <div className="mt-3 font-bold">
          {sentenceArray?.map((sentence, i) => (
            <span key={i}>
              {sentence}
              {sentenceArray.length !== i + 1 && (
                <div className="inline-block">
                  {answer[i] ? (
                    <span className="bg-neutral-300 px-4 py-2 rounded-md">
                      {answer[i]}
                    </span>
                  ) : (
                    <span className="bg-neutral-300 px-4 py-2 rounded-md">
                      ___________
                    </span>
                  )}
                </div>
              )}
            </span>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {options?.map((opt, index) => (
            <div
              key={index}
              className="bg-neutral-400 text-white px-4 py-2 rounded-md"
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cloze;
