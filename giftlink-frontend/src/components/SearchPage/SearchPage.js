import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';

function SearchPage() {

    //Task 1: Define state variables for the search query, age range, and search results.
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [ageYears, setAgeYears] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const searchGifts = async () => {
        try {
            const params = new URLSearchParams();

            if (query) params.append('name', query);
            if (category) params.append('category', category);
            if (condition) params.append('condition', condition);
            if (ageYears) params.append('age_years', ageYears);

            const url = `${urlConfig.backendUrl}/api/search?${params.toString()}`;
            console.log('Search URL:', url);

            const response = await fetch(url);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        navigate(`/detail/${productId}`);
    };




    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            <label className="mt-2">Category</label>
                            <select
                                className="form-select dropdown-filter"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <label className="mt-2">Condition</label>
                            <select
                                className="form-select dropdown-filter"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            >
                                <option value="">All Conditions</option>
                                {conditions.map((cond, index) => (
                                    <option key={index} value={cond}>{cond}</option>
                                ))}
                            </select>

                            <label className="mt-3">Max Age: {ageYears} years</label>
                            <input
                                type="range"
                                className="form-range age-range-slider"
                                min="0"
                                max="18"
                                value={ageYears}
                                onChange={(e) => setAgeYears(e.target.value)}
                            />
                        </div>
                    </div>
                    <label className="mt-3">Search by Name</label>
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Enter gift name"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-primary mt-3 search-button" onClick={searchGifts}>
                        Search
                    </button>
                    <div className="mt-4">
                    {searchResults.length === 0 ? (
                        <div className="alert alert-warning text-center">No gifts found.</div>
                    ) : (
                        <div className="row">
                            {searchResults.map((gift) => (
                                <div
                                    key={gift.id}
                                    className="col-md-4 mb-4"
                                    onClick={() => goToDetailsPage(gift.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card search-results-card">
                                        {gift.image ? (
                                            <img src={gift.image} alt={gift.name} className="card-img-top" />
                                        ) : (
                                            <div className="no-image-available-large text-center p-4">No Image</div>
                                        )}
                                        <div className="card-body">
                                            <h5 className="card-title">{gift.name}</h5>
                                            <p className="card-text"><strong>Category:</strong> {gift.category}</p>
                                            <p className="card-text"><strong>Condition:</strong> {gift.condition}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
