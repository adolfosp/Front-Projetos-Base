import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { About } from "./Steps/About";
import { Confirm } from "./Steps/Confirm";
import { Contact } from "./Steps/Contact";
import { Education } from "./Steps/Education";
import { Stepper } from "./Steps/Stepper";
import { AppProvider } from "./state";

export const App = () => {
  return (
    <div className="App">
      <AppProvider>
        <Router>
          <Stepper />
          <Routes>
            <Route path="/" element={<Contact />} />
            <Route path="/education" element={<Education />} />
            <Route path="/about" element={<About />} />
            <Route path="/confirm" element={<Confirm />} />
          </Routes>
        </Router>
      </AppProvider>
    </div>
  );
};

