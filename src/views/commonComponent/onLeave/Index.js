import React from "react";
import {Carousel} from "react-bootstrap";
import {useGetOnLeave} from "../../../query/onLeave/onLeaveQuery";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";

const BirthdayCard = () => {
    const {data: onLeaveData, isLoading: isOnLeaveLoading} = useGetOnLeave();

    return (
        <>
            <Carousel fade indicators={onLeaveData?.length <= 1 ? false : true} controls={false}>
                {isOnLeaveLoading ? (
                    <div className="onLeaveCard">
                        <div className="name">
                            <Loader />
                        </div>
                    </div>
                ) : onLeaveData && onLeaveData.length > 0 ? (
                    onLeaveData.map((item, index) => (
                        <Carousel.Item key={index}>
                            <div className="onLeaveCard cardShadow">
                                <div className="name">
                                    <p>
                                        {item.first_name} <span>is on leave today.</span>
                                    </p>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))
                ) : (
                    <Carousel.Item>
                        <div className="onLeaveCard">
                            <div className="name">
                                <p>No One Is On Leave Today</p>
                            </div>
                        </div>
                    </Carousel.Item>
                )}
            </Carousel>
        </>
    );
};

export default BirthdayCard;
