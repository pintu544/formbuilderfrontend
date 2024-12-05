/* eslint-disable react/prop-types */
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Input from "../custom/Input";
import ImageSvg from "../svgs/ImageSvg";
import RichText from "../RichText";
import DragSvg from "../svgs/DragSvg";
import CloseSvg from "../svgs/CloseSvg";

const Cloze = ({ idx, questionInfo, setQuestions, errors }) => {
  const handleSentenceEdit = (text) => {
    setQuestions((prev) => {
      let clone = prev;

      const newOptions = [];
      if (text.length - prev[idx].sentence.length > 3) {
        const regex = /<u>(.*?)<\/u>/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          if (!clone[idx].options.find((opt) => opt === match[1])) {
            newOptions.push(match[1]);
          }
        }
      }

      clone[idx] = {
        ...clone[idx],
        sentence: text,
        options: [
          ...clone[idx].options.filter((opt) => opt.trim()),
          ...newOptions,
          "",
        ],
      };
      return [...clone];
    });
  };

  const handleChange = (event) => {
    if (event.target.name !== "image") {
      return setQuestions((prev) => {
        let clone = prev;
        clone[idx] = { ...clone[idx], [event.target.name]: event.target.value };
        return [...clone];
      });
    }
    if (
      event.target.files[0]?.type === "image/jpeg" ||
      event.target.files[0]?.type === "image/png" ||
      event.target.files[0]?.type === "image/jpg"
    ) {
      setQuestions((prev) => {
        let clone = prev;
        clone[idx] = {
          ...clone[idx],
          imageUrl: URL.createObjectURL(event.target.files[0]),
          imageFile: event.target.files[0],
        };
        return [...clone];
      });
    } else {
      setQuestions((prev) => {
        let clone = prev;
        clone[idx] = {
          ...clone[idx],
          imageUrl: "",
          imageFile: "",
        };
        return [...clone];
      });
      event.target.value = null;
    }
  };

  const removeImage = () => {
    setQuestions((prev) => {
      const clone = [...prev];
      clone[idx].imageFile = "";
      clone[idx].imageUrl = "";
      return clone;
    });
  };

  const handleOptionChange = (event) => {
    const optionNo = Number(event.target.name.replace("option", ""));
    setQuestions((prev) => {
      let clone = prev;
      let options = clone[idx].options;
      options[optionNo] = event.target.value;
      if (options.length === optionNo + 1 && event.target.value.trim())
        options.push("");
      clone[idx] = { ...clone[idx], options };
      return [...clone];
    });
  };

  const onOptionDragEnd = (result) => {
    if (!result.destination) return;
    setQuestions((prev) => {
      if (prev[idx].options.length === 1) return prev;
      const clone = [...prev];
      const reorderedOptions = [...clone[idx].options];

      const [reorderedItem] = reorderedOptions.splice(result.source.index, 1);
      reorderedOptions.splice(result.destination.index, 0, reorderedItem);

      clone[idx].options = reorderedOptions;
      return clone;
    });
  };

  const removeOption = (categoryNo) => {
    setQuestions((prev) => {
      if (prev[idx].options.length === 1) return prev;
      const clone = [...prev];
      const options = clone[idx].options.filter((_, i) => i !== categoryNo);
      clone[idx].options = options;
      return clone;
    });
  };

  return (
    <div className="flex-grow p-4 bg-white border-l-8 border-solid border-l-neutral-800 border-t border-t-neutral-100 rounded-md shadow-md">
      <div className="flex justify-between">
        <div className="font-semibold">Question {idx + 1}</div>
        <div className="font-medium">Cloze</div>
        <div className="w-20">
          <Input
            type="number"
            placeholder="Points"
            name="points"
            value={questionInfo.points}
            onChange={handleChange}
            isInvalid={errors?.points}
          />
        </div>
      </div>
      <div className="flex items-end">
        <div className="w-[min(100%,500px)] flex-grow">
          <Input
            label="Preview"
            disabled={true}
            value={questionInfo.sentence
              .replace("<p>", "")
              .replace("</p>", "")
              .replace(/<u>(.*?)<\/u>/g, "______")}
          />
        </div>
        <div className="inline-block relative ms-1 mb-[1px]">
          <input
            type="file"
            className="absolute top-0 left-0 opacity-0 w-full h-full"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <div className="w-8">
            <ImageSvg />
          </div>
        </div>
      </div>
      {questionInfo.imageUrl && (
        <div className="mt-2 h-28 relative max-w-max">
          <img
            src={questionInfo.imageUrl}
            alt="categoryImage"
            className="h-full max-w-full object-contain"
          />
          <div
            className="w-5 absolute top-1 right-1 z-10 cursor-pointer invert"
            onClick={removeImage}
          >
            <CloseSvg />
          </div>
        </div>
      )}
      <div className="mt-2">
        <div className="font-medium">Sentence*</div>
        <div
          className={`w-full px-2 py-1 outline-none border-2 border-solid ${
            errors?.sentence ? "border-red-400" : "border-neutral-300"
          } rounded-md`}
        >
          <RichText
            content={questionInfo.sentence}
            setEditorContent={handleSentenceEdit}
          />
        </div>
      </div>
      <div className="mt-2">
        <div className="font-medium">Options</div>
        <DragDropContext onDragEnd={onOptionDragEnd}>
          <Droppable droppableId={`optionsList${idx}`}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {questionInfo.options.map((e, i) => (
                  <Draggable
                    key={i}
                    index={i}
                    draggableId={`option-${idx}-${i}`}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mt-2 text-sm w-48 flex items-center"
                      >
                        <button
                          className={`w-5 ${
                            snapshot.isDragging
                              ? "cursor-grabbing"
                              : "cursor-grab"
                          }`}
                        >
                          <DragSvg />
                        </button>
                        <Input
                          name={`option${i}`}
                          placeholder={`Option ${i + 1} (Optional)`}
                          value={e}
                          onChange={handleOptionChange}
                          isInvalid={errors?.options && errors?.options[i]}
                        />
                        <button
                          className="w-5 ms-1 cursor-pointer"
                          onClick={() => removeOption(i)}
                        >
                          <CloseSvg />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Cloze;
