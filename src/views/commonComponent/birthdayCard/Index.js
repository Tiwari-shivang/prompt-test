import React, {Suspense} from "react";
import {Button, Col, Carousel} from "react-bootstrap";
import {FaUserAlt} from "react-icons/fa";
import {useGetBirthday} from "../../../query/birthday/birthdayQuery";
import "./style.scss";
import Loader from "../../widgets/loader/Loader";

const BirthdayCard = () => {
    const {data, isLoading} = useGetBirthday();

    return (
        <>
            <Carousel fade indicators={data?.length == 1 ? false : true} controls={false}>
                {isLoading ? (
                    <div className="birthdayCard">
                        <div className="name">
                            <Loader />
                        </div>
                    </div>
                ) : data && data.length > 0 ? (
                    data.map((item, index) => (
                        <Carousel.Item key={index}>
                            <div className="birthdayCard cardShadow">
                                <div className="pic">
                                    {item && item.profile_picture ? (
                                        <img src={item.profile_picture} alt="" />
                                    ) : (
                                        <FaUserAlt className="userIcon" />
                                    )}
                                </div>
                                <div className="name">
                                    <p>
                                        {item.first_name} {item.last_name}
                                        <span>has birthday today.</span>
                                    </p>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))
                ) : (
                    <div className="birthdayCard">
                        <div className="name">
                            <p>No Birthdays Today</p>
                        </div>
                    </div>
                )}
            </Carousel>
        </>
    );
};

export default BirthdayCard;
