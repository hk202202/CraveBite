import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { AnimatePresence } from "framer-motion";
import MainContainer from "./components/MainContainer";
import CreateContainer from "./components/CreateContainer";
import { ToastContainer } from "react-toastify";
import RestaurantList from "./components/RestaurantList";
import Footer from "./components/Footer";
import AdminPage from "./components/AdminPage";
import ViewRestaurant from "./components/ViewRestaurant";
import EditForm from "./components/EditForm";

function App() {
  return (
    <AnimatePresence mode="wait">
      <div className=" h-auto flex flex-col bg-primary">
        <Header />
        <main className="mt-14 md:mt-20 p-8 py-4 w-full md:px-16">
          <Routes>
            <Route path="/" element={<MainContainer />} />
            <Route path="/createItem" element={<AdminPage />} />
            <Route path="/add-restaurant" element={<CreateContainer />} />
            <Route path="/view-restaurants" element={<ViewRestaurant />} />
            <Route path="/menu" element={<RestaurantList />} />
            <Route path="/edit/:id" element={<EditForm />} />
          </Routes>
          <ToastContainer />
        </main>
        <Footer />
      </div>
    </AnimatePresence>
  );
}

export default App;