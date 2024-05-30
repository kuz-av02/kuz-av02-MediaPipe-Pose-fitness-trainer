import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Pushup from "./Components/Pushup/Pushup"
import Squats from "./Components/Squats/Squats"
import Corner from "./Components/Corner/Corner"

function App() {
    return (
        <Router>
            <Switch>
                {/* Настраиваем маршрутизацию для разных упражнений */}
                <Route exact path="/exercise/pushup" component={Pushup}></Route>
                <Route exact path="/exercise/squat" component={Squats}></Route>
                <Route exact path="/exercise/сorner" component={Corner}></Route>
            </Switch>
        </Router>
    )
}

export default App
