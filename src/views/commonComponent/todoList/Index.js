import React, {useEffect, useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {FaCircle, FaPencilAlt, FaTrashAlt} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import {useAddTodo} from "../../../query/todo/addTodo/addTodoQuery";
import {useGetTodo} from "../../../query/todo/allTodo/allTodoQuery";
import {useDeleteTodo} from "../../../query/todo/deleteTodo/deleteTodoQuery";
import {useUpdateTodo} from "../../../query/todo/updateTodo/updateTodoQuery";
import {authState} from "../../../recoil/authRecoil";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import {convert24Hourto12Hour} from "../../../utilits/usefulFunctions";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";

const Index = () => {
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const empDetail = useRecoilValue(authState);
    const {data: allTodo, isLoading: isAllTodoLoading} = useGetTodo(empDetail && empDetail.uuid);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentTodoUuid, setCurrentTodoUuid] = useState("");
    const [formData, setFormData] = useState({
        task_action: "",
        priority: "",
        task_date: "",
        time_from: "",
        time_to: "",
    });
    const {isLoading: isLoadingUpdateTodo, mutateAsync: updateTodoMutateAsync} = useUpdateTodo();
    const {isLoading: isLoadingAddTodo, mutateAsync: addTodoMutateAsync} = useAddTodo();
    const {isLoading: isLoadingDeleteTodo, mutateAsync: deleteMutateAsync} = useDeleteTodo();

    const todoDeleteHandler = (todo_uuid) => {
        setCurrentTodoUuid(todo_uuid);
        setShowDeleteModal(true, todo_uuid);
    };
    const todoEditClickHandler = (
        todo_uuid,
        task_action,
        priority,
        task_date,
        time_from,
        time_to
    ) => {
        setFormData({
            task_action: task_action,
            priority: priority,
            task_date: task_date,
            time_from: time_from,
            time_to: time_to,
        });
        setCurrentTodoUuid(todo_uuid);
        setShowAddEditModal(true);
    };
    const todoAddClickHandler = () => {
        setFormData({task: "", priority: "", date: "", startTime: "", endTime: ""});
        setCurrentTodoUuid(0);
        setShowAddEditModal(true);
    };
    return (
        <>
            <div className="myTodoList cardShadow">
                <div className="titleRow">
                    <div className="cardCustomTitle">My Todo List</div>
                    <Button
                        className="addTaskBtn"
                        variant="primary"
                        disabled={isLoadingAddTodo || isLoadingUpdateTodo}
                        onClick={todoAddClickHandler}
                    >
                        {isLoadingAddTodo
                            ? "Adding..."
                            : isLoadingUpdateTodo
                            ? "Updating..."
                            : "Add Task"}
                    </Button>
                </div>
                <div className="todoList customScroll">
                    {isAllTodoLoading ? (
                            <Loader />
                    ) : allTodo && !allTodo.length ? (
                        <div className="emptyListText">No Tasks Found</div>
                    ) : allTodo && allTodo.length > 0 ? (
                        allTodo.map(
                            ({todo_uuid, priority, task_action, task_date, time_from, time_to}) => (
                                <>
                                    <div
                                        className={`todoCard ${
                                            priority === "Low"
                                                ? "lowStrip"
                                                : priority === "Medium"
                                                ? "mediumStrip"
                                                : "highStrip"
                                        }`}
                                    >
                                        <div
                                            className={`head ${
                                                priority === "Low"
                                                    ? "lowBackground"
                                                    : priority === "Medium"
                                                    ? "mediumBackground"
                                                    : "highBackground"
                                            }`}
                                        >
                                            <div className="priorityText">
                                                <span
                                                    className={`priority ${
                                                        priority === "Low"
                                                            ? "lowPriority"
                                                            : priority === "Medium"
                                                            ? "mediumPriority"
                                                            : "highPriority"
                                                    }`}
                                                >
                                                    {priority}
                                                </span>
                                                <span className="timeInfo">
                                                    {convert24Hourto12Hour(time_from.substr(11, 5))}{" "}
                                                    - {convert24Hourto12Hour(time_to.substr(11, 5))}
                                                </span>
                                            </div>
                                            <div>
                                                <button
                                                    disabled={isLoadingUpdateTodo}
                                                    className="btn btn-outline-primary btn-sm btn-hollow editBtn"
                                                    onClick={() =>
                                                        todoEditClickHandler(
                                                            todo_uuid,
                                                            task_action,
                                                            priority,
                                                            task_date,
                                                            time_from,
                                                            time_to
                                                        )
                                                    }
                                                >
                                                    <FaPencilAlt />
                                                </button>
                                                <button
                                                    disabled={isLoadingDeleteTodo}
                                                    className="btn btn-outline-danger btn-sm btn-hollow delBtn"
                                                    onClick={() => todoDeleteHandler(todo_uuid)}
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            className={`todoTimeInfo ${
                                                priority === "Low"
                                                    ? "lowBackground"
                                                    : priority === "Medium"
                                                    ? "mediumBackground"
                                                    : "highBackground"
                                            }`}
                                        >
                                            <div className="dateInfo">
                                                {new Date(task_date).getDate()}{" "}
                                                {new Date(task_date).toLocaleString("default", {
                                                    month: "long",
                                                })}{" "}
                                                {new Date(task_date).getFullYear() ==
                                                new Date().getFullYear()
                                                    ? ""
                                                    : new Date(task_date).getFullYear()}
                                            </div>
                                        </div>
                                        <p className="task">{task_action}</p>
                                    </div>
                                </>
                            )
                        )
                    ) : (
                        <div className="noTaskText">No Tasks Found.</div>
                    )}
                </div>
            </div>
            <DeleteTodoListModal
                deleteUuid={currentTodoUuid}
                deleteModalOpen={showDeleteModal}
                isLoadingDeleteTodo={isLoadingDeleteTodo}
                deleteMutateAsync={deleteMutateAsync}
                deleteModalClose={() => setShowDeleteModal(false)}
            />
            <AddEditTodoListModal
                todoUuid={currentTodoUuid}
                showModal={showAddEditModal}
                closeModal={() => setShowAddEditModal(false)}
                formData={formData}
                isLoadingUpdateTodo={isLoadingUpdateTodo}
                updateTodoMutateAsync={updateTodoMutateAsync}
                isLoadingAddTodo={isLoadingAddTodo}
                addTodoMutateAsync={addTodoMutateAsync}
            />
        </>
    );
};

export const AddEditTodoListModal = ({
    todoUuid,
    showModal,
    closeModal,
    formData,
    isLoadingUpdateTodo,
    updateTodoMutateAsync,
    isLoadingAddTodo,
    addTodoMutateAsync,
}) => {
    const {register, handleSubmit, reset, watch, errors, formState} = useForm({
        mode: "onChange",
    });
    useEffect(() => {
        reset(
            todoUuid
                ? {
                      ...formData,
                      time_from: formData.time_from.substr(11, 5),
                      time_to: formData.time_to.substr(11, 5),
                  }
                : {task_action: "", priority: "", task_date: "", time_from: "", time_to: ""}
        );
    }, [formData]);
    const timeFrom = watch("time_from");
    const empDetail = useRecoilValue(authState);
    // const { isLoading: isLoadingUpdateTodo, mutateAsync: updateTodoMutateAsync } = useUpdateTodo()
    // const { isLoading: isLoadingAddTodo, mutateAsync: addTodoMutateAsync } = useAddTodo()
    const onSubmit = (data) => {
        const addVal = {
            ...data,
            "emp_uuid": empDetail && empDetail.uuid,
            "is_schedule": false,
        };

        const updateVal = {
            ...data,
            "todo_uuid": todoUuid,
            "emp_uuid": empDetail && empDetail.uuid,
            "is_schedule": false,
        };

        if (todoUuid) {
            updateTodoMutateAsync(updateVal);
        } else {
            addTodoMutateAsync(addVal);
        }
        closeModal();
    };

    return (
        <>
            <Modal className="commonModal" show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{todoUuid ? "Update" : "Add"} Todo Task</Modal.Title>
                </Modal.Header>
                <Modal.Body className="myModalBody mt-3">
                    <form className="formTodo" onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={12} className="mb-3">
                                <label>Task</label>
                                <Input
                                    type="text"
                                    rows="3"
                                    id="text-edit"
                                    className="form-control"
                                    name="task_action"
                                    reference={register({
                                        required: requiredField(),
                                    })}
                                />
                                {errors.task_action && (
                                    <small className="form-text text-danger">
                                        {errors.task_action.message}
                                    </small>
                                )}
                            </Col>
                            <Col sm={12} className="mb-3">
                                <label>Date</label>
                                <Input
                                    type="date"
                                    className="form-control"
                                    name="task_date"
                                    max="9999-01-01"
                                    reference={register({
                                        required: requiredField(),
                                        validate: {
                                            greaterThan: (v) => {
                                                if (new Date(v) < new Date(new Date().toISOString().split('T')[0]))
                                                    return "Date can't be past.";
                                                else return true;
                                            },
                                        },
                                    })}
                                />
                                {errors.task_date && (
                                    <small className="form-text text-danger">
                                        {errors.task_date.message}
                                    </small>
                                )}
                            </Col>
                            <Col sm={12} className="mb-3">
                                <Row>
                                    <Col sm={12} md={6} className="dateCol to">
                                        <label>Start Time *</label>
                                        <Input
                                            type="time"
                                            className="form-control"
                                            name="time_from"
                                            error={errors.time_from}
                                            reference={register({
                                                required: requiredField(),
                                                valueAsDate: true,
                                            })}
                                        />
                                        {errors.time_from && (
                                            <small className="form-text text-danger">
                                                {errors.time_from.message}
                                            </small>
                                        )}
                                    </Col>
                                    <Col sm={12} md={6} className="dateCol to">
                                        <label>End Time *</label>
                                        <Input
                                            type="time"
                                            className="form-control"
                                            name="time_to"
                                            error={errors.time_to}
                                            reference={register({
                                                required: requiredField(),
                                                valueAsDate: true,
                                                validate: {
                                                    greaterThan: (v) => {
                                                        if (timeFrom > new Date(v)) {
                                                            return "Date can't be past.";
                                                        } else return true;
                                                    },
                                                },
                                            })}
                                        />
                                        {errors.time_to && (
                                            <small className="form-text text-danger">
                                                {errors.time_to.message}
                                            </small>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={12} className="mb-3">
                                <label>Priority *</label>
                                <select
                                    className="form-control dropdown-bar"
                                    name="priority"
                                    ref={register({
                                        required: requiredField(),
                                    })}
                                >
                                    <option value="">Select</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                {errors.priority && (
                                    <small className="form-text text-danger">
                                        {errors.priority.message}
                                    </small>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} className="buttonSection">
                                <Button
                                    className="btn btn-primary addBtn"
                                    disabled={
                                        !formState.isValid ||
                                        (todoUuid ? isLoadingUpdateTodo : isLoadingAddTodo)
                                    }
                                    type="submit"
                                >
                                    {todoUuid
                                        ? isLoadingUpdateTodo
                                            ? "Updating..."
                                            : "Update"
                                        : isLoadingAddTodo
                                        ? "Adding..."
                                        : "Add"}
                                </Button>
                                <Button className="btn btn-danger" onClick={closeModal}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export const DeleteTodoListModal = ({
    deleteModalOpen,
    deleteModalClose,
    deleteMutateAsync,
    deleteUuid,
    isLoadingDeleteTodo,
}) => {
    const TodoListHandler = (e) => {
        e.preventDefault();
        deleteMutateAsync(deleteUuid);
        deleteModalClose();
    };
    return (
        <>
            <Modal
                className="commonModal deleteTodoModal"
                show={deleteModalOpen}
                onHide={deleteModalClose}
                centered
            >
                <Modal.Body>
                    <div className="cardCustomTitle">Delete todo task</div>
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this task ?</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button variant="primary" onClick={(e) => TodoListHandler(e)}>
                                    {isLoadingDeleteTodo ? "Deleting..." : "Yes"}
                                </Button>
                                <Button variant="outline-danger" onClick={deleteModalClose}>
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Index;
