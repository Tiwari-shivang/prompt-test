import Moment from "moment";
import React, {useEffect, useState} from "react";
import {Button, Carousel, Col, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {AiOutlineEye} from "react-icons/ai";
import {BiSend} from "react-icons/bi";
import {
    BsEmojiLaughing,
    BsEmojiLaughingFill,
    BsHandThumbsUp,
    BsHandThumbsUpFill,
    BsHeart,
    BsHeartFill,
    BsLightbulb,
    BsLightbulbFill,
    BsTrash,
} from "react-icons/bs";
import {FaCircle, FaComment, FaReply, FaUserAlt} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import {
    useAddHexaviewBuzzComment,
    useAddHexaviewBuzzCommentReact,
    useAddHexaviewBuzzReact,
    useAddHexaviewBuzzReplyOnComment,
} from "../../../query/members/addMembers/addMembersQuery";
import {
    useGetHexaviewBuzz,
    useGetHexaviewBuzzAllRepliesOnComments,
    useGetHexaviewBuzzCommentsAndLikes,
} from "../../../query/members/allMembers/allMembersQuery";
import {
    useUnreactOnHexaviewBuzz,
    useUnreactOnHexaviewBuzzComment,
} from "../../../query/members/updateMembers/updateMembersQuery";
import {authState} from "../../../recoil/authRecoil";
import {formatDate} from "../../../utilits/usefulFunctions";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";
import {useDeleteHexaviewBuzzComment} from "../../../query/members/deleteMembers/deleteMembersQuery";

const HexaviewBuzz = () => {
    const {data: hexaBuzzes, isLoading: ishexaBuzzLoading} = useGetHexaviewBuzz();
    const [isImageModalOpen, setImageModal] = useState(false);
    const [isCommentModalOpen, setCommentModalShow] = useState(false);
    const [isOpenLoadRepliesCommentUuid, setIsOpenLoadRepliesCommentUuid] = useState("");
    const [image, setImage] = useState("");
    const [currentBuzzUuid, setCurrentBuzzUuid] = useState("");
    const {mutateAsync: addCommentMutateAsync, isLoading: isLoadingAddComment} =
        useAddHexaviewBuzzComment();
    const empDetail = useRecoilValue(authState);
    const {data: hexaBuzzCommentsAndLikes, isLoading: isLoadingHexaBuzzCommentsAndLikes} =
        useGetHexaviewBuzzCommentsAndLikes({
            buzzUuid: currentBuzzUuid,
            empUuid: empDetail?.uuid,
        });
    const {mutateAsync: unreactHexaviewBuzzMutateAsync} = useUnreactOnHexaviewBuzz();
    const {mutateAsync: unreactHexaviewBuzzCommentMutateAsync} = useUnreactOnHexaviewBuzzComment();

    const {mutateAsync: reactHexaviewBuzzMutateAsync} = useAddHexaviewBuzzReact();
    const {mutateAsync: hexaviewBuzzCommentReactMutateAsync} = useAddHexaviewBuzzCommentReact();
    const {data: repliesOnComment, isLoading: isLoadingRepliesOnComment} =
        useGetHexaviewBuzzAllRepliesOnComments({
            commentUuid: isOpenLoadRepliesCommentUuid,
            empUuid: empDetail?.uuid,
        });
    const [commentPlaceholderTextName, setCommentPlaceholderTextName] = useState("");
    const {mutateAsync: addReplyOnCommentMutateAsync, isLoading: isLoadingAddReplyOnComment} =
        useAddHexaviewBuzzReplyOnComment();
    const {mutateAsync: deleteCommentMutateAsync} = useDeleteHexaviewBuzzComment();
    const [commentToReplyUuid, setCommentToReplyUuid] = useState("");
    const imageClickHandler = (i) => {
        setImage(i);
        setImageModal(true);
    };
    const commentClickHandler = () => {
        if (!isLoadingHexaBuzzCommentsAndLikes) setCommentModalShow(true);
    };
    const loadRepliesClickHandler = (uuid) => {
        setIsOpenLoadRepliesCommentUuid(uuid);
    };
    const carouselIndexChangeListener = (index) => {
        setCurrentBuzzUuid(ishexaBuzzLoading ? "qqqqq" : hexaBuzzes[index]?.buzz_uuid);
    };
    const commentDeleteClickHandler = (commentUuid) => {
        const val = {
            commentUuid: commentUuid,
            empUuid: empDetail?.uuid,
        };
        deleteCommentMutateAsync(val);
    };
    const reactOnBuzzClickHandler = (name, isReact) => {
        //name: what reaction, isReact: react or remove the reaction(bool)
        if (isReact === false)
            unreactHexaviewBuzzMutateAsync({
                hexaviewBuzzUuid: currentBuzzUuid,
                empUuid: empDetail?.uuid,
            });
        else {
            reactHexaviewBuzzMutateAsync({
                buzzUuid: currentBuzzUuid,
                empUuid: empDetail?.uuid,
                reactionType: name,
            });
        }
    };

    const reactOnBuzzCommenthandler = (isReact, commentUuid) => {
        if (isReact) {
            hexaviewBuzzCommentReactMutateAsync({
                commentUuid: commentUuid,
                empUuid: empDetail?.uuid,
                reactionType: "like",
            });
        } else {
            unreactHexaviewBuzzCommentMutateAsync({
                commentUuid: commentUuid,
                empUuid: empDetail?.uuid,
            });
        }
    };

    const {register, handleSubmit, reset, errors, formState} = useForm({
        mode: "onChange",
    });

    const replyClickHandler = (commentUuid, name) => {
        setCommentToReplyUuid(commentUuid);
        setCommentPlaceholderTextName(name);
    };

    useEffect(() => {
        setCurrentBuzzUuid(ishexaBuzzLoading ? "" : hexaBuzzes[0]?.buzz_uuid);
    }, hexaBuzzes);

    const commentPostHandler = ({comment}) => {
        if (commentToReplyUuid !== "") {
            const val = {
                comment_uuid: commentToReplyUuid,
                reply: `@${commentPlaceholderTextName}: ${comment}`,
                emp_uuid: empDetail?.uuid,
            };
            addReplyOnCommentMutateAsync(val);
            setCommentToReplyUuid("");
            setCommentPlaceholderTextName(``);
            setIsOpenLoadRepliesCommentUuid(commentToReplyUuid);
            reset({});
            return;
        }
        const val = {
            emp_uuid: empDetail?.uuid,
            comment: comment.trim(),
            buzz_uuid: currentBuzzUuid,
        };
        addCommentMutateAsync(val);
        reset({});
        //need to get comment uuid
    };

    return (
        <div className="hexaviewBuzz cardShadow">
            <Carousel
                fade
                interval={null}
                indicators={hexaBuzzes?.length <= 1 ? false : true}
                controls={false}
                onSelect={(e) => carouselIndexChangeListener(e)}
            >
                {ishexaBuzzLoading ? (
                    <div className="contentSection">
                        <div className="loadingScreen">
                            <Loader />
                        </div>
                    </div>
                ) : (hexaBuzzes && hexaBuzzes.length === 0) || !hexaBuzzes ? (
                    <Carousel.Item>
                        <div className="contentSection d-flex justify-content-center">No Buzzes yet.</div>
                    </Carousel.Item>
                ) : (
                    hexaBuzzes &&
                    hexaBuzzes.map((item, index) => (
                        <Carousel.Item key={index}>
                            <div className="contentSection">
                                <div className="imgSection">
                                    <div className="imgBox">
                                        {item && item.photo ? (
                                            <img
                                                src={item.photo}
                                                onClick={() => imageClickHandler(item.photo)}
                                                alt=""
                                            />
                                        ) : (
                                            <FaUserAlt className="userIcon" />
                                        )}
                                        <div
                                            className="greyHover"
                                            onClick={() => imageClickHandler(item.photo)}
                                        >
                                            <AiOutlineEye />
                                        </div>
                                    </div>
                                </div>
                                <div className="detailSection">
                                    <h5 className="cardCustomTitle">
                                        <span>{item?.title}</span>
                                    </h5>
                                    <p className="customScroll">{item?.description}</p>
                                </div>
                            </div>
                            <div className="actionIcons">
                                <div className="hoverBoxAndLike">
                                    <BsHandThumbsUp className="likeOut" />
                                    <span>React</span>
                                    <div className="actions">
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{show: 150, hide: 250}}
                                            overlay={<Tooltip id="button-tooltip">Like</Tooltip>}
                                        >
                                            <div className="reactionDiv">
                                                {hexaBuzzCommentsAndLikes?.is_reacted_by_current_employee ==
                                                    false ||
                                                hexaBuzzCommentsAndLikes?.reaction_type_by_current_employee !=
                                                    "like" ? (
                                                    <BsHandThumbsUp
                                                        className="icon like"
                                                        id="buzzLike"
                                                        onClick={() =>
                                                            reactOnBuzzClickHandler("like", true)
                                                        }
                                                    />
                                                ) : (
                                                    <BsHandThumbsUpFill
                                                        className="icon likeFill"
                                                        id="buzzLike"
                                                        onClick={() =>
                                                            reactOnBuzzClickHandler("like", false)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{show: 200, hide: 250}}
                                            overlay={<Tooltip id="button-tooltip">Love</Tooltip>}
                                        >
                                            <div className="reactionDiv">
                                                {hexaBuzzCommentsAndLikes?.is_reacted_by_current_employee ==
                                                    false ||
                                                hexaBuzzCommentsAndLikes?.reaction_type_by_current_employee !=
                                                    "love" ? (
                                                    <BsHeart
                                                        className="icon heart"
                                                        onClick={() =>
                                                            reactOnBuzzClickHandler("love", true)
                                                        }
                                                    />
                                                ) : (
                                                    <BsHeartFill
                                                        className="icon heartFill"
                                                        onClick={() =>
                                                            reactOnBuzzClickHandler("love", false)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{show: 200, hide: 250}}
                                            overlay={
                                                <Tooltip id="button-tooltip">Insightful</Tooltip>
                                            }
                                        >
                                            <div className="reactionDiv">
                                                {hexaBuzzCommentsAndLikes?.is_reacted_by_current_employee ==
                                                    false ||
                                                hexaBuzzCommentsAndLikes?.reaction_type_by_current_employee !=
                                                    "insightful" ? (
                                                    <BsLightbulb
                                                        className="icon idea"
                                                        onClick={() =>
                                                            reactOnBuzzClickHandler(
                                                                "insightful",
                                                                true
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <BsLightbulbFill
                                                        className="icon ideaFill"
                                                        onClick={() =>
                                                            reactOnBuzzClickHandler(
                                                                "insightful",
                                                                false
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{show: 150, hide: 250}}
                                            overlay={<Tooltip id="button-tooltip">Funny</Tooltip>}
                                        >
                                            <div className="reactionDiv">
                                                {hexaBuzzCommentsAndLikes?.is_reacted_by_current_employee ==
                                                    false ||
                                                hexaBuzzCommentsAndLikes?.reaction_type_by_current_employee !=
                                                    "funny" ? (
                                                    <BsEmojiLaughing
                                                        className="icon laugh"
                                                        onClick={() =>
                                                            reactOnBuzzClickHandler("funny", true)
                                                        }
                                                    />
                                                ) : (
                                                    <BsEmojiLaughingFill
                                                        className="icon laughFill"
                                                        onClick={() =>
                                                            reactOnBuzzClickHandler("funny", false)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <div className="reactionsAndComments">
                                    {isLoadingHexaBuzzCommentsAndLikes ? (
                                        ""
                                    ) : (
                                        <span>
                                            {hexaBuzzCommentsAndLikes?.total_reactions} reaction
                                            {hexaBuzzCommentsAndLikes?.total_reactions != 1
                                                ? "s"
                                                : ""}
                                            :
                                        </span>
                                    )}
                                    <div className="reactionCount">
                                        {" "}
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{show: 200, hide: 250}}
                                            overlay={
                                                <Tooltip id="button-tooltip">
                                                    {isLoadingHexaBuzzCommentsAndLikes
                                                        ? "-"
                                                        : hexaBuzzCommentsAndLikes?.like_count}
                                                </Tooltip>
                                            }
                                        >
                                            <div className="reactionDiv likeMiniDiv">
                                                <BsHandThumbsUpFill className="iconMini likeMini" />
                                            </div>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{show: 200, hide: 250}}
                                            overlay={
                                                <Tooltip id="button-tooltip">
                                                    {isLoadingHexaBuzzCommentsAndLikes
                                                        ? "-"
                                                        : hexaBuzzCommentsAndLikes?.love_count}
                                                </Tooltip>
                                            }
                                        >
                                            <div className="reactionDiv heartMiniDiv">
                                                <BsHeartFill className="iconMini heartMini" />
                                            </div>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{show: 200, hide: 250}}
                                            overlay={
                                                <Tooltip id="button-tooltip">
                                                    {isLoadingHexaBuzzCommentsAndLikes
                                                        ? "-"
                                                        : hexaBuzzCommentsAndLikes?.insightful_count}
                                                </Tooltip>
                                            }
                                        >
                                            <div className="reactionDiv ideaMiniDiv">
                                                <BsLightbulbFill className="iconMini ideaMini" />
                                            </div>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{show: 200, hide: 250}}
                                            overlay={
                                                <Tooltip id="button-tooltip">
                                                    {isLoadingHexaBuzzCommentsAndLikes
                                                        ? "-"
                                                        : hexaBuzzCommentsAndLikes?.funny_count}
                                                </Tooltip>
                                            }
                                        >
                                            <div className="reactionDiv laughMiniDiv">
                                                <BsEmojiLaughingFill className="iconMini laughMini" />
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                    <div className="comments">
                                        <FaComment
                                            className="icon comment"
                                            onClick={commentClickHandler}
                                        />
                                        <div className="commentNumber number">
                                            {isLoadingHexaBuzzCommentsAndLikes
                                                ? "-"
                                                : hexaBuzzCommentsAndLikes?.total_comments}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))
                )}
            </Carousel>
            {isImageModalOpen && (
                <Modal
                    show={isImageModalOpen}
                    onHide={() => setImageModal(false)}
                    centered
                    className="imageModal"
                >
                    <Modal.Body>
                        {image ? <img src={image} /> : <FaUserAlt className="userIcon" />}
                    </Modal.Body>
                </Modal>
            )}
            {isCommentModalOpen && (
                <Modal
                    show={isCommentModalOpen}
                    onHide={() => setCommentModalShow(false)}
                    centered
                    className="commentsModal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Comments</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="commentsList customScroll">
                            {hexaBuzzCommentsAndLikes?.hexaviewbuzz_comments_response_list.length ==
                            0 ? (
                                <p className="emptyListText">No comments.</p>
                            ) : (
                                // hexaBuzzCommentsAndLikes?.hexaviewbuzz_comments_response_list?.map(({ comment, created_at, reacted_by_current_employee, total_reactions_on_comment, comment_by: { first_name, last_name, designation_name, profile_picture } }) => <Col sm={12} className='comment'>
                                hexaBuzzCommentsAndLikes?.hexaviewbuzz_comments_response_list?.map(
                                    ({
                                        comment_replies,
                                        comment_uuid,
                                        comment,
                                        created_at,
                                        reacted_by_current_employee,
                                        total_reactions_on_comment,
                                        comment_by: {
                                            uuid: commenterUuid,
                                            first_name,
                                            last_name,
                                            designation_name,
                                            profile_picture,
                                        },
                                    }) => (
                                        <Col sm={12} className="comment">
                                            <span>
                                                <img src={profile_picture}></img>
                                            </span>
                                            <span className="textContent">
                                                <div className="nameDateAndReaction">
                                                    <div>
                                                        <span className="name">
                                                            {first_name} {last_name}
                                                        </span>
                                                        <FaCircle className="dot" />
                                                        <span className="date">
                                                            {formatDate(
                                                                Moment(created_at).format(
                                                                    "YYYY-MM-DD"
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="reactions">
                                                        {commenterUuid == empDetail?.uuid ? (
                                                            <div className="deleteInfo me-1">
                                                                <BsTrash
                                                                    onClick={() =>
                                                                        commentDeleteClickHandler(
                                                                            comment_uuid
                                                                        )
                                                                    }
                                                                    className="icon delete"
                                                                />
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                        <div className="likesInfo">
                                                            {reacted_by_current_employee ? (
                                                                <BsHeartFill
                                                                    onClick={() =>
                                                                        reactOnBuzzCommenthandler(
                                                                            false,
                                                                            comment_uuid
                                                                        )
                                                                    }
                                                                    className="icon heart filled"
                                                                />
                                                            ) : (
                                                                <BsHeart
                                                                    onClick={() =>
                                                                        reactOnBuzzCommenthandler(
                                                                            true,
                                                                            comment_uuid
                                                                        )
                                                                    }
                                                                    className="icon heart"
                                                                />
                                                            )}
                                                            <div className="commentLikeNumber">
                                                                {isLoadingHexaBuzzCommentsAndLikes
                                                                    ? "-"
                                                                    : total_reactions_on_comment >
                                                                      999
                                                                    ? "1k+"
                                                                    : total_reactions_on_comment}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="designation">{designation_name}</p>
                                                <p className="text">{comment}</p>
                                                <div className="repliesSection">
                                                    <Button
                                                        onClick={() =>
                                                            replyClickHandler(
                                                                comment_uuid,
                                                                first_name
                                                            )
                                                        }
                                                        variant="primary"
                                                        className="replyButton"
                                                        size="sm"
                                                    >
                                                        <FaReply className="replyIcon" />
                                                        Reply
                                                    </Button>
                                                    {comment_replies ? (
                                                        <>
                                                            <p
                                                                className="repliesLoadAndHideButton"
                                                                onClick={() =>
                                                                    loadRepliesClickHandler(
                                                                        comment_uuid
                                                                    )
                                                                }
                                                            >
                                                                {comment_replies}{" "}
                                                                {comment_replies !== 1
                                                                    ? "replies"
                                                                    : "reply"}
                                                            </p>
                                                            {isOpenLoadRepliesCommentUuid ==
                                                                comment_uuid &&
                                                            !isLoadingRepliesOnComment ? (
                                                                <p
                                                                    className="repliesLoadAndHideButton ms-2"
                                                                    onClick={() =>
                                                                        loadRepliesClickHandler("")
                                                                    }
                                                                >
                                                                    Hide
                                                                </p>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                {comment_uuid == isOpenLoadRepliesCommentUuid
                                                    ? repliesOnComment?.map(
                                                          ({
                                                              profile_picture,
                                                              reply_uuid,
                                                              reply,
                                                              designation,
                                                              created_at,
                                                              liked_by_current_employee,
                                                              likes_on_reply,
                                                              reply_by,
                                                          }) => (
                                                              <Row className="replyCommentRow">
                                                                  <Col sm={12} className="comment">
                                                                      <span>
                                                                          <img
                                                                              src={profile_picture}
                                                                          ></img>
                                                                      </span>
                                                                      <span className="textContent">
                                                                          <div className="nameDateAndReaction">
                                                                              <div>
                                                                                  <span className="name">
                                                                                      {reply_by}
                                                                                  </span>
                                                                                  <FaCircle className="dot" />
                                                                                  <span className="date">
                                                                                      {formatDate(
                                                                                          Moment(
                                                                                              created_at
                                                                                          ).format(
                                                                                              "YYYY-MM-DD"
                                                                                          )
                                                                                      )}
                                                                                  </span>
                                                                              </div>
                                                                              <div className="reactions">
                                                                                  <div className="likesInfo">
                                                                                      {liked_by_current_employee ? (
                                                                                          <BsHeartFill className="icon heart filled" />
                                                                                      ) : (
                                                                                          <BsHeart
                                                                                              className="icon heart"
                                                                                              onClick={() =>
                                                                                                  reactOnBuzzCommenthandler(
                                                                                                      true,
                                                                                                      reply_uuid
                                                                                                  )
                                                                                              }
                                                                                          />
                                                                                      )}
                                                                                      <div className="commentLikeNumber">
                                                                                          {isLoadingRepliesOnComment
                                                                                              ? "-"
                                                                                              : likes_on_reply >
                                                                                                999
                                                                                              ? "1k+"
                                                                                              : likes_on_reply}
                                                                                      </div>
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                          <p className="designation">
                                                                              {designation}
                                                                          </p>
                                                                          <p className="text">
                                                                              {reply}
                                                                          </p>
                                                                          <div className="repliesSection">
                                                                              <Button
                                                                                  onClick={() =>
                                                                                      replyClickHandler(
                                                                                          comment_uuid,
                                                                                          reply_by
                                                                                      )
                                                                                  }
                                                                                  variant="primary"
                                                                                  className="replyButton"
                                                                                  size="sm"
                                                                              >
                                                                                  <FaReply className="replyIcon" />
                                                                                  Reply
                                                                              </Button>
                                                                          </div>
                                                                      </span>
                                                                  </Col>
                                                              </Row>
                                                          )
                                                      )
                                                    : ""}
                                            </span>
                                        </Col>
                                    )
                                )
                            )}
                        </Row>
                        <form onSubmit={handleSubmit(commentPostHandler)}>
                            <Row className="textRow">
                                <Col sm={10} xs={9} className="px-0">
                                    <textarea
                                        type="text"
                                        id="text-edit"
                                        name="comment"
                                        placeholder={
                                            commentPlaceholderTextName == ""
                                                ? "Add a comment"
                                                : `reply to ${commentPlaceholderTextName}`
                                        }
                                        className="form-control"
                                        ref={register({
                                            validate: {
                                                check: (v) =>
                                                    v.trim().length > 0
                                                        ? true
                                                        : "Can't be an empty comment.",
                                            },
                                        })}
                                    ></textarea>
                                    {/* <small className="form-text text-danger">Hello  sadlkfhslja</small> */}
                                    {/* {errors.comment && (<small className='form-text text-danger'>{errors.comment.message}</small>)} */}
                                </Col>
                                <Col sm={2} xs={3} className="px-0">
                                    <Button
                                        size="sm"
                                        className="btn btn-light px-0 d-flex"
                                        type="submit"
                                        disabled={!formState.isValid || isLoadingAddComment}
                                    >
                                        {isLoadingAddComment ? "Posting..." : "Post"}
                                        {isLoadingAddComment ? "" : <BiSend className="icon" />}
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default HexaviewBuzz;
