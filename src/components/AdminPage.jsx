/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="min-h-screen flex  justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-8">
        {/* Add Restaurant Card */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Add Restaurant</h2>
          <p className="text-gray-600 mb-4">
            Click below to add a new restaurant and its details.
          </p>
          <Link
            to="/add-restaurant"
            className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition duration-300"
          >
            Add Restaurant
          </Link>
        </div>

        {/* View Restaurant List Card */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">View Restaurant List</h2>
          <p className="text-gray-600 mb-4">
            Click below to view the list of existing restaurants.
          </p>
          <Link
            to="/view-restaurants"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            View Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
