import React from "react";
import { BrowserRouter, Route } from 'react-router-dom';

import App from "./App";

const routes = (
	<BrowserRouter>
		<div>
			<Route exact path="/" component={App} />
		</div>
	</BrowserRouter>
);

export default routes;