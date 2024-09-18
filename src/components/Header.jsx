/* eslint-disable no-unused-vars */
import Logo from "../assets/images/logo.png";
import Avatar from "../assets/images/avatar.png";
import { MdAdd, MdLogout, MdShoppingCart } from "react-icons/md";
import { motion } from "framer-motion";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { app } from "../firebase.config";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { successToaster } from "../utils/toastify";
import goToTop from "../utils/goToTop";
import ImageWithFallback from "./ImageComponent";

const Header = () => {
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [{ user, cartShow, cartItems }, dispatch] = useStateValue();

  const [isMenu, setIsMenu] = useState();

  const login = async () => {
    if (!user) {
      const {
        user: { refreshToken, providerData },
      } = await signInWithPopup(firebaseAuth, provider);

      dispatch({
        type: actionType.SET_USER,
        user: providerData[0],
      });

      localStorage.setItem("user", JSON.stringify(providerData[0]));
      successToaster("User Logged in");
    } else {
      setIsMenu(!isMenu);
    }
  };

  const logout = () => {
    setIsMenu(!isMenu);

    dispatch({
      type: actionType.SET_USER,
      user: null,
    });

    localStorage.clear();
    navigate("/");
    successToaster("User Logged out");
  };

  const showCart = () => {
    dispatch({
      type: actionType.SET_CART_SHOW,
      cartShow: !cartShow,
    });
  };
  return (
    <header className="w-screen fixed z-50 bg-primary p-3 px-4 md:p-6 md:px-16">
      {/* Desktop */}
      <div className="hidden md:flex w-full h-full items-center justify-between ">
        <div>
          <Link to={"/"} className="flex items-center gap-2">
            <ImageWithFallback
              src={Logo}
              alt=""
              className="w-8 object-cover"
              loading="lazy"
            />
            <p className="text-headingColor  text-xl font-bold"> CraveBite</p>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <motion.ul
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="flex items-center gap-8 "
          >
            <Link
              to="/"
              onClick={goToTop()}
              className="text-base text-textColor cursor-pointer hover:text-headingColor duration-100 transition-all ease-in-out"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={goToTop()}
              className="text-base text-textColor cursor-pointer hover:text-headingColor duration-100 transition-all ease-in-out"
            >
              Menu
            </Link>
            <Link
              to="/"
              onClick={goToTop()}
              className="text-base text-textColor cursor-pointer hover:text-headingColor duration-100 transition-all ease-in-out"
            >
              About Us
            </Link>
            <Link
              to="/"
              onClick={goToTop()}
              className="text-base text-textColor cursor-pointer hover:text-headingColor duration-100 transition-all ease-in-out"
            >
              Service
            </Link>
          </motion.ul>
          <div
            className="relative flex items-center justify-center"
            onClick={showCart}
          >
            <MdShoppingCart className="text-textColor text-2xl  cursor-pointer" />
            {cartItems && cartItems.length > 0 && (
              <div className=" absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center">
                <p className="text-xs text-white font-semibold">
                  {cartItems.length}
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <motion.img
              whileTap={{ scale: 0.6 }}
              src={user ? user?.photoURL : Avatar}
              alt="userimage"
              className="w-10 min-w-[40px] cursor-pointer rounded-full"
              onClick={login}
            />
            {isMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="w-40 bg-gray-50 top-12 -right-10 shadow-xl flex flex-col rounded-lg absolute"
              >
                {/* {user && user.email === "g.nishi9525@gmail.com" && (
                  <Link to="/createItem">
                    <p
                      onClick={() => setIsMenu(false)}
                      className="px-4 py-2 flex items gap-3 cursor-pointer hover:bg-slate-200 transition-all duration-100 ease-in-out text-textColor text-base hover:rounded-lg"
                    >
                      New Item <MdAdd />
                    </p>
                  </Link>
                )} */}
                <Link to="/createItem">
                  <p
                    onClick={() => setIsMenu(false)}
                    className="px-4 py-2 flex items gap-3 cursor-pointer hover:bg-slate-200 transition-all duration-100 ease-in-out text-textColor text-base hover:rounded-lg"
                  >
                    New Item <MdAdd />
                  </p>
                </Link>
                <p
                  className="m-2 p-2 flex items gap-3 justify-center bg-slate-100 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-textColor text-base hover:rounded-lg rounded-md shadow-md"
                  onClick={logout}
                >
                  Logout <MdLogout />
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between md:hidden w-full ">
        <Link to={"/"} className="flex items-center gap-2">
          <img src={Logo} alt="" className="w-8 object-cover" loading="lazy" />
          <p className="text-headingColor  text-xl font-bold"> CraveBite</p>
        </Link>

        <div className="flex justify-center gap-4">
          <div
            className="relative flex items-center justify-center"
            onClick={showCart}
          >
            <MdShoppingCart className="text-textColor text-2xl  cursor-pointer" />
            {cartItems && cartItems.length > 0 && (
              <div className=" absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center">
                <p className="text-xs text-white font-semibold">
                  {cartItems.length}
                </p>
              </div>
            )}
          </div>
          <div className="relative">
            <motion.img
              whileTap={{ scale: 0.6 }}
              src={user ? user.photoURL : Avatar}
              alt="userimage"
              className="w-10 min-w-[40px] cursor-pointer rounded-full"
              onClick={login}
            />

            {isMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="w-40 bg-gray-50 top-12 -right-2 shadow-xl flex flex-col rounded-lg absolute"
              >
                {/* {user && user.email === "g.nishi9525@gmail.com" && (
                  <Link to="/createItem">
                    <p
                      onClick={() => setIsMenu(false)}
                      className="px-4 py-2 flex items gap-3 cursor-pointer hover:bg-slate-200 transition-all duration-100 ease-in-out text-textColor text-base hover:rounded-lg"
                    >
                      New Item <MdAdd />
                    </p>
                  </Link>
                )} */}
                <Link to="/createItem">
                  <p
                    onClick={() => setIsMenu(false)}
                    className="px-4 py-2 flex items gap-3 cursor-pointer hover:bg-slate-200 transition-all duration-100 ease-in-out text-textColor text-base hover:rounded-lg"
                  >
                    New Item <MdAdd />
                  </p>
                </Link>
                <ul className="flex flex-col ">
                  <Link
                    to="/"
                    onClick={() => {
                      setIsMenu(false);
                      goToTop();
                    }}
                    className=" hover:bg-slate-200 px-4 py-2 text-base text-textColor cursor-pointer hover:text-headingColor duration-100 transition-all ease-in-out"
                  >
                    Home
                  </Link>
                  <Link
                    to="/menu"
                    onClick={() => {
                      setIsMenu(false);
                      goToTop();
                    }}
                    className=" hover:bg-slate-200 px-4 py-2 text-base text-textColor cursor-pointer hover:text-headingColor duration-100 transition-all ease-in-out"
                  >
                    Menu
                  </Link>
                  <Link
                    to="/"
                    onClick={() => {
                      setIsMenu(false);
                      goToTop();
                    }}
                    className=" hover:bg-slate-200 px-4 py-2 text-base text-textColor cursor-pointer hover:text-headingColor duration-100 transition-all ease-in-out"
                  >
                    About Us
                  </Link>
                  <Link
                    to="/"
                    onClick={() => {
                      setIsMenu(false);
                      goToTop();
                    }}
                    className=" hover:bg-slate-200 px-4 py-2 text-base text-textColor cursor-pointer hover:text-headingColor duration-100 transition-all ease-in-out"
                  >
                    Service
                  </Link>
                </ul>
                <p
                  className="m-2 p-2 flex items gap-3 justify-center bg-slate-100 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-textColor text-base hover:rounded-lg rounded-md shadow-md"
                  onClick={logout}
                >
                  Logout <MdLogout />
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
