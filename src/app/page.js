"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

library.add(faCheck, faEdit, faTrashAlt);

const taskSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(15, "Title must be no more than 15 characters long")
    .regex(
      /^[a-zA-Z0-9\s]*$/,
      "Title can only include letters, numbers, and spaces"
    ),
  desc: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .max(30, "Description must be no more than 30 characters long"),
});

const Page = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mainTask, setMainTask] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");

  const SubmitHandler = (e) => {
    e.preventDefault();

    const result = taskSchema.safeParse({ title, desc });
    if (!result.success) {
      toast.error(result.error.issues[0].message, {
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    const newTask = { title, desc, completed: false };

    if (editIndex > -1) {
      setMainTask(
        mainTask.map((task, index) => (index === editIndex ? newTask : task))
      );
      setEditIndex(-1);
      toast.success("Task updated successfully", {
        autoClose: 3000,
        hideProgressBar: true,
      });
    } else {
      setMainTask([...mainTask, newTask]);
      toast.success("Task added successfully", {
        autoClose: 3000,
        hideProgressBar: true,
      });
    }

    setTitle("");
    setDesc("");
  };

  const deleteHandler = (index, fromMainTask = true) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      if (fromMainTask) {
        setMainTask(mainTask.filter((_, i) => i !== index));
      } else {
        setCompletedTasks(completedTasks.filter((_, i) => i !== index));
      }
      toast.error("Task deleted successfully", {
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setTitle(mainTask[index].title);
    setDesc(mainTask[index].desc);
  };

  const toggleComplete = (index) => {
    const updatedTasks = mainTask.map((task, i) => {
      if (i === index) {
        const updatedTask = { ...task, completed: !task.completed };
        if (updatedTask.completed) {
          setMainTask(mainTask.filter((_, i) => i !== index));
          setCompletedTasks([...completedTasks, updatedTask]);
        } else {
          setCompletedTasks(completedTasks.filter((_, i) => i !== index));
        }
        return updatedTask;
      }
      return task;
    });
    setMainTask(updatedTasks);
  };
  const filteredTasks = mainTask.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTask =
    filteredTasks.length > 0 ? (
      filteredTasks.map(
        (task, index) =>
          !task.completed && (
            <li key={index}>
              <div className="grid grid-cols-12  ">
                <div className="col-span-12 md:col-span-6 lg:col-span-4 py-2.5 ">
                  <h4 className="text-base md:text-lg lg:text-xl xl:text-3xl font-bold mb-2">
                    Title:
                  </h4>
                  <h5 className="text-sm md:text-lg lg:text-xl xl:text2xl my-1">
                    {task.title}
                  </h5>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4  py-2.5">
                  <h4 className="text-base md:text-lg lg:text-xl xl:text-3xl font-bold mb-2">
                    Description:
                  </h4>
                  <h6 className="text-sm md:text-lg lg:text-xl xl:text2xl my-1">
                    {task.desc}
                  </h6>
                </div>

                <div className="col-span-12 md:col-span-6 lg:col-span-4 py-2 px-1 lg:justify-self-center md:justify-self-start sm:justify-self-start ">
                  <FontAwesomeIcon
                    icon={["fas", "check"]}
                    className="cursor-pointer text-green-400  mr-6 size-6  my-2"
                    onClick={() => toggleComplete(index)}
                    title="Complete Task"
                  />

                  <FontAwesomeIcon
                    icon={["fas", "edit"]}
                    className="cursor-pointer text-blue-400 mr-6 size-6 my-2 "
                    onClick={() => startEdit(index)}
                    title="Edit Task"
                  />

                  <FontAwesomeIcon
                    icon={["fas", "trash-alt"]}
                    className="cursor-pointer text-red-400 mr-6 size-6 my-2 "
                    onClick={() => deleteHandler(index)}
                    title="Delete Task"
                  />
                </div>
              </div>
            </li>
          )
      )
    ) : (
      <h2>No Task Available</h2>
    );

  const renderCompletedTasks =
    completedTasks.length > 0 ? (
      completedTasks.map((task, index) => (
        <li key={index} className="   mb-8">
          <div className=" grid grid-cols-12 ">
            <div className="col-span-12 md:col-span-6 lg:col-span-4 py-2.5 ">
              <h4 className=" text-base md:text-lg lg:text-xl xl:text-3xl font-bold mb-2">
                Title:
              </h4>
              <h5 className="text-sm md:text-lg lg:text-xl xl:text-2xl my-1">
                {task.title}
              </h5>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 py-2.5 ">
              <h4 className=" text-base md:text-lg lg:text-xl xl:text-3xl font-bold mb-2">
                Description:
              </h4>
              <h6 className="text-sm md:text-lg lg:text-xl xl:text-2xl ">
                {task.desc}
              </h6>
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4 py-2 lg:justify-self-center ">
              <FontAwesomeIcon
                icon={["fas", "trash-alt"]}
                className="cursor-pointer text-red-400 mr-8 size-6 my-2"
                onClick={() => deleteHandler(index, false)}
                title="Delete Task"
              />
            </div>
          </div>
        </li>
      ))
    ) : (
      <h2>No Completed Tasks</h2>
    );

  return (
    <>
      <h1 className="bg-black w-full p-5 text-center text-lg text-white font-bold md:text-xl lg:text-2xl xl:text-4xl">
        MY TO DO LIST
      </h1>
      <div className="w-full">
        <form onSubmit={SubmitHandler} className="grid grid-cols-12 w-full">
          <input
            className="col-span-12 md:col-span-6 lg:col-span-3   text-2xl border-zinc-800 border m-3 md:m-3 lg:m-4 px-4 py-2 "
            placeholder="Enter Title Here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="col-span-12 md:col-span-6 lg:col-span-3 text-2xl border-zinc-800 border m-3 md:m-3 lg:m-4 px-4 py-2 "
            placeholder="Enter Description Here"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            className="col-span-12 md:col-span-6 lg:col-span-3 text-2xl border-zinc-800 border m-3 md:m-3 lg:m-4 px-4 py-2 "
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="col-span-12 md:col-span-6 lg:col-span-3 bg-black text-white px-4 py-2 text-base font-medium lg:m-4 md:text-lg lg:text-lg xl:text-lg rounded m-3 md:m-3">
            {editIndex > -1 ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
      <hr />
      <div className="p-8 w-full bg-slate-200">
        <h2 className="text-base font-bold md:text-lg lg:text-xl xl:text-3xl">
          Active Tasks
        </h2>
        <br />
        <ul>{renderTask}</ul>
      </div>
      <div className="p-8 w-full bg-green-200">
        <h2 className="text-base font-bold md:text-lg lg:text-xl xl:text-3xl">
          Completed Tasks
        </h2>
        <br />
        <ul>{renderCompletedTasks}</ul>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
