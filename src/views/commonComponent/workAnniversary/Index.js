import React from "react";
import {Carousel} from "react-bootstrap";
import {FaUserAlt} from "react-icons/fa";
import {useGetWorkAnniversary} from "../../../query/workAnniversary/anniversaryQuery";
import "./style.scss";
import Loader from "../../widgets/loader/Loader";
const WorkAnniversary = () => {
    const {data, isLoading} = useGetWorkAnniversary();

    return (
        <>
            <Carousel fade indicators={data?.length == 1 ? false : true} controls={false}>
                {isLoading ? (
                    <div className="anniversaryCard ">
                        <div className="name">
                                <Loader />
                        </div>
                    </div>
                ) : data && data.length > 0 ? (
                    data.map((item, index) => (
                        <Carousel.Item key={index}>
                            <div className="anniversaryCard cardShadow">
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
                                        <span>Has Anniversary Today</span>
                                    </p>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))
                ) : (
                    <div className="anniversaryCard">
                        <div className="name">
                            <p>No Work Anniversaries Today</p>
                        </div>
                    </div>
                )}
            </Carousel>
        </>
    );
};

export default WorkAnniversary;
