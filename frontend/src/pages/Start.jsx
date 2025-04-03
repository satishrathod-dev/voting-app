import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1571609549239-bf07fb79f702?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover", // changed from cover to contain
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        position: "fixed", // add this
        top: 0, // add this
        left: 0, // add this
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="bg-gray-200/80 p-3 sm:p-14 rounded-xl shadow-md max-w-md w-full mx-auto">
        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">
          Welcome Voting App
        </h2>
        <p className="text-gray-600 mb-6 text-center">Every vote counts...</p>
        <Link
          to="/login"
          className="block bg-blue-500 text-white py-3 px-6 rounded-full text-center hover:bg-blue-600 transition duration-200"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Start;
