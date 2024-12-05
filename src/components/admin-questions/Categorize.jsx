/* eslint-disable react/prop-types */
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Input from "../custom/Input";
import Select from "../custom/Select";
import CloseSvg from "../svgs/CloseSvg";
import ImageSvg from "../svgs/ImageSvg";
import DragSvg from "../svgs/DragSvg";

const Categorize = ({ idx, questionInfo, setQuestions, errors }) => {
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

  const handleCategoryChange = (event) => {
    const categoryNo = Number(
      event.target.name.replace(`category-${idx}-`, "")
    );
    setQuestions((prev) => {
      let clone = prev;
      let categories = clone[idx].categories;
      categories[categoryNo] = event.target.value;
      if (categories.length === categoryNo + 1 && event.target.value.trim())
        categories.push("");
      clone[idx] = { ...clone[idx], categories };
      return [...clone];
    });
  };

  const handleItemsBelongsToChange = (event) => {
    const type = /item+/.test(event.target.name) ? "item" : "belongsTo";
    const itemNo = Number(event.target.name.replace(type, ""));
    setQuestions((prev) => {
      let clone = prev;
      let itemsWithBelongsTo = clone[idx].itemsWithBelongsTo;
      itemsWithBelongsTo[itemNo] = {
        ...itemsWithBelongsTo[itemNo],
        [type]: event.target.value,
      };
      if (
        type === "item" &&
        itemsWithBelongsTo.length === itemNo + 1 &&
        event.target.value.trim()
      )
        itemsWithBelongsTo.push("");
      clone[idx] = { ...clone[idx], itemsWithBelongsTo };
      return [...clone];
    });
  };

  const removeCategory = (categoryNo) => {
    setQuestions((prev) => {
      if (prev[idx].categories.length === 1) return prev;
      const clone = [...prev];
      const categories = clone[idx].categories.filter(
        (_, i) => i !== categoryNo
      );
      clone[idx].categories = categories;
      return clone;
    });
  };

  const removeItemBelongsTo = (itemNo) => {
    setQuestions((prev) => {
      if (prev[idx].itemsWithBelongsTo.length === 1) return prev;
      let clone = [...prev];
      let itemsWithBelongsTo = clone[idx].itemsWithBelongsTo.filter(
        (_, i) => i !== itemNo
      );
      clone[idx] = { ...clone[idx], itemsWithBelongsTo };
      return [...clone];
    });
  };

  const onCategoryDragEnd = (result) => {
    if (!result.destination) return;
    setQuestions((prev) => {
      if (prev[idx].categories.length === 1) return prev;
      const clone = [...prev];
      const reorderedCategories = [...clone[idx].categories];

      const [reorderedItem] = reorderedCategories.splice(
        result.source.index,
        1
      );
      reorderedCategories.splice(result.destination.index, 0, reorderedItem);

      clone[idx].categories = reorderedCategories;
      return clone;
    });
  };

  const onItemDragEnd = (result) => {
    if (!result.destination) return;
    setQuestions((prev) => {
      if (prev[idx].itemsWithBelongsTo.length === 1) return prev;
      const clone = [...prev];
      const reorderedItems = [...clone[idx].itemsWithBelongsTo];

      const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, reorderedItem);

      clone[idx].itemsWithBelongsTo = reorderedItems;
      return clone;
    });
  };

  return (
    <div className="p-4 bg-white border-l-8 border-solid border-l-neutral-800 border-t border-t-neutral-100 rounded-md shadow-md">
      <div className="flex justify-between">
        <div className="font-semibold">Question {idx + 1}</div>
        <div className="font-medium">Categorize</div>
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
      <div className="mt-4 flex">
        <div className="flex-grow w-[min(100%,500px)]">
          <Input
            placeholder="Description (Optional)"
            name="description"
            value={questionInfo.description}
            onChange={handleChange}
          />
        </div>
        <div className="inline-block relative ms-1">
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
      <div className="mt-4">
        <div className="font-medium text-sm">Categories</div>
        <DragDropContext onDragEnd={onCategoryDragEnd}>
          <Droppable droppableId={`categoryList${idx}`}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {questionInfo.categories.map((e, i) => (
                  <Draggable
                    key={i}
                    index={i}
                    draggableId={`category-${idx}-${i}`}
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
                          name={`category-${idx}-${i}`}
                          placeholder={`Category ${i + 1} (Optional)`}
                          value={e}
                          onChange={handleCategoryChange}
                          isInvalid={
                            errors?.categories && errors?.categories[i]
                          }
                        />
                        <button
                          className="w-5 ms-1 cursor-pointer"
                          onClick={() => removeCategory(i)}
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
      <div className="mt-4">
        <div className="flex w-96">
          <div className="w-5"></div>
          <div className="flex-1 font-medium text-sm px-1">Item</div>
          <div className="flex-1 font-medium text-sm px-1">Belongs To</div>
          <div className="flex-none w-5"></div>
        </div>
        <DragDropContext onDragEnd={onItemDragEnd}>
          <Droppable droppableId={`itemList${idx}`}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {questionInfo.itemsWithBelongsTo.map((e, i) => (
                  <Draggable key={i} index={i} draggableId={`item-${idx}-${i}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center w-96 mt-1"
                      >
                        <button
                          className={`w-4 ${
                            snapshot.isDragging
                              ? "cursor-grabbing"
                              : "cursor-grab"
                          }`}
                        >
                          <DragSvg />
                        </button>
                        <div className="flex-1 pe-1 text-sm">
                          <Input
                            name={`item${i}`}
                            placeholder={`Item ${i + 1} (Optional)`}
                            value={e.item}
                            onChange={handleItemsBelongsToChange}
                            isInvalid={
                              errors?.itemsWithBelongsTo &&
                              errors?.itemsWithBelongsTo[i]
                            }
                          />
                        </div>
                        <div className="flex-1 px-1">
                          <Select
                            name={`belongsTo${i}`}
                            placeholder="Choose Option"
                            value={e.belongsTo}
                            onChange={handleItemsBelongsToChange}
                            list={questionInfo.categories
                              .filter((e) => e)
                              .map((e) => ({
                                value: e,
                                label: e,
                              }))}
                            isInvalid={
                              errors?.itemsWithBelongsTo &&
                              errors?.itemsWithBelongsTo[i]
                            }
                          />
                        </div>
                        <button
                          className="flex-none w-[17px] ms-1 cursor-pointer"
                          onClick={() => removeItemBelongsTo(i)}
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

export default Categorize;
