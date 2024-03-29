import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../Sheard/Loading/Loading";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import defaultImage from "../../../assets/images/reviewDefaultimage.png";
import "@smastrom/react-rating/style.css";
import { Rating, Star } from "@smastrom/react-rating";
import { FaRegStar, FaStar } from "react-icons/fa";


const ReviewComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { axiosSecure } = useAxiosSecure();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [totalData, setTotalData] = useState(20);

  let currentPage = 1;

  const dataPerPage = 20;
  let pageNumbers = [];
  const totalPages = Math.ceil(totalData / dataPerPage);

  const pageNumber = Number(queryParams.get("page"));
  if (Number(pageNumber >= 1)) {
    currentPage = pageNumber;
  }

  for (let i = currentPage - 3; i <= currentPage + 3; i++) {
    if (i < 1) continue;
    if (i > totalPages) break;
    pageNumbers.push(i);
  }
  useEffect(() => {
    setLoading(true);
    let skip = (currentPage - 1) * dataPerPage;
    axiosSecure
      .get(`/get-all-reviews?skip=${skip}&limit=${dataPerPage}`)
      .then((res) => {
        console.log(res?.data?.data);
        setReviews(res?.data?.data || []);
        setTotalData(res?.data?.meta?.total || 20);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err?.message);
      });
  }, [currentPage]);

  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <div className="max-w-[1200px] mx-auto py-10 md:px-10 px-4">
      <h2 className="text-center md:text-4xl text-2xl font-semibold my-10">
        Reviews
      </h2>
      <hr className="border my-10" />
      <div>
        <h4 className="section-title text-xl font-semibold border-b-2 inline border-black pb-2">
          Product Review {totalData}
        </h4>
        <div className="px-2">
          <div className="grid grid-cols-1 md:grid-cols-3 mx-auto gap-5">
            {reviews?.map((r, id) => {
              const { name, rating, review, avatar } = r?.user_review;
              return (
                <div
                  key={i}
                  className="review border mt-5 p-4 rounded-lg text-center"
                >
                  <div className="h-full">
                    <div className="flex flex-col justify-between h-full">
                      <img
                        className="h-[100px] w-[100px] mx-auto my-4 object-contain rounded-full"
                        src={avatar ? avatar : defaultImage}
                        alt=""
                      />
                      <p>{name}</p>
                      <div className="py-2 my-2">
                        <Rating
                          placeholderRating={3.5}
                          emptySymbol={<FaRegStar/>}
                          placeholderSymbol={<FaRegStar />}
                          fullSymbol={<FaStar />}
                        />
                      </div>
                      <p>{review}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center my-5">
            {currentPage - 1 >= 1 && (
              <>
                <Link to={"/reviews"}>{"<<"}</Link>
              </>
            )}
            {pageNumbers?.map((page, i) => (
              <Link
                className={
                  page === currentPage
                    ? "bg-black px-2 py-1 rounded text-white mx-2"
                    : "border-2 px-2 py-1 rounded mx-2"
                }
                key={i}
                to={`/reviews?page=${page}`}
              >
                {page}
              </Link>
            ))}
            {currentPage + 1 <= totalPages && (
              <>
                <Link to={"/reviews"}>{">>"}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent;
