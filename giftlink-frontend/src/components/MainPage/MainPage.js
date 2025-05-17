import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Task 1: Write async fetch operation
        // Write your code below this line
        fetch(`${urlConfig.backendUrl}/api/gifts`)
            .then((res) => res.json())
            .then((data) => setGifts(data))
            .catch((err) => console.error("Failed to fetch gifts:", err));
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/detail/${productId}`);
      };      

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        // Write your code below this line
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US");

      };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">

                            {/* // Task 4: Display gift image or placeholder */}
                            {/* // Write your code below this line */}
                            <img
                            src={gift.image || "/placeholder.jpg"}
                            className="card-img-top"
                            alt={gift.name}
                            />

                            <div className="card-body">

                                {/* // Task 5: Display gift image or placeholder */}
                                {/* // Write your code below this line */}
                                <h5 className="card-title">{gift.name}</h5>

                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                {gift.condition}
                                </p>

                                {/* // Task 6: Display gift image or placeholder */}
                                {/* // Write your code below this line */}
                                <p className="card-text">Posted on: {formatDate(gift.timestamp)}</p>
                                

                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
