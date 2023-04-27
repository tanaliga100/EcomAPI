import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";

const RootLayout = () => {
  const location = useLocation();
  const content = {
    login: "Login",
    signUp: "Sign Up",
    logout: "Logout",
  };
  return (
    <Container>
      <Navbar {...content} />
      <Outlet />
      {location.pathname === "/" && <Footer />}
    </Container>
  );
};
export default RootLayout;

const Container = styled.main`
  /* background-color: #d2b48c; */
`;
