import React, { Suspense, lazy } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import NotFound from '../components/notFound/notFound';
import Sidebar from '../components/layout/sidebar/sidebar';
import LoadingScreen from '../components/loading/loadingScreen';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([
        import('../pages/Login/login'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Home = lazy(() => {
    return Promise.all([
        import('../pages/Event/event'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EventDetail = lazy(() => {
    return Promise.all([
        import('../pages/Event/EventDetail/eventDetail'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EventCreate = lazy(() => {
    return Promise.all([
        import('../pages/Event/EventCreate/eventCreate'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EventReject = lazy(() => {
    return Promise.all([
        import('../pages/Event/EventReject/eventReject'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EventApproved = lazy(() => {
    return Promise.all([
        import('../pages/Event/EventApproved/eventApproved'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrganizingEvent = lazy(() => {
    return Promise.all([
        import('../pages/JoinedStudent/OrganizingEvent/OrganizingEvent'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrganizedEvent = lazy(() => {
    return Promise.all([
        import('../pages/JoinedStudent/OrganizedEvent/organizedEvent'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AccountManagement = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/accountManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrganizingEventDetails = lazy(() => {
    return Promise.all([
        import('../pages/JoinedStudent/OrganizingEvent/OrganizingEventDetails/organizingEventDetails'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrganizedEventDetails = lazy(() => {
    return Promise.all([
        import('../pages/JoinedStudent/OrganizedEvent/OrganizedEventDetails/organizedEventDetails'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AccountCreate = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/AccountCreate/accountCreate'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Notification = lazy(() => {
    return Promise.all([
        import('../pages/Notifications/notification'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EvaluationForm = lazy(() => {
    return Promise.all([
        import('../pages/EvaluationForm/evaluationForm'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ProductList = lazy(() => {
    return Promise.all([
        import('../pages/ProductList/productList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const CategoryList = lazy(() => {
    return Promise.all([
        import('../pages/CategoryList/categoryList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const DashBoard = lazy(() => {
    return Promise.all([
        import('../pages/DashBoard/dashBoard'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const NewsList = lazy(() => {
    return Promise.all([
        import('../pages/News/news'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EventEdit = lazy(() => {
    return Promise.all([
        import('../pages/Event/EventEdit/eventEdit'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Profile = lazy(() => {
    return Promise.all([
        import('../pages/Profile/profile'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ChangePassword = lazy(() => {
    return Promise.all([
        import('../pages/ChangePassword/changePassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrderList = lazy(() => {
    return Promise.all([
        import('../pages/OrderList/orderList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const RouterURL = withRouter(({ location }) => {

    const checkAuth = () => {
        return localStorage.getItem('role');
    }

    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Suspense fallback={<LoadingScreen />}>
                    <Login />
                </Suspense>
            </PublicRoute>
            <PublicRoute exact path="/news-list">
                <NewsList />
            </PublicRoute>
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>
            <PublicRoute exact path="/reset-password/:id">
                <ChangePassword />
            </PublicRoute>
        </div>
    )

    const DefaultContainer = () => (
        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)' }}>
                        <PrivateRoute exact path="/dash-board">
                            <Suspense fallback={<LoadingScreen />}>
                                <DashBoard />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/event">
                            <Suspense fallback={<LoadingScreen />}>
                                <Home />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/event-detail/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <EventDetail />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/event-create">
                            <Suspense fallback={<LoadingScreen />}>
                                <EventCreate />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/event-edit/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <EventEdit />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/event-reject">
                            <Suspense fallback={<LoadingScreen />}>
                                <EventReject />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/event-approved">
                            <Suspense fallback={<LoadingScreen />}>
                                <EventApproved />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/organizing-event">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrganizingEvent />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/organized-event">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrganizedEvent />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/profile">
                            <Suspense fallback={<LoadingScreen />}>
                                <Profile />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>

                        <PrivateRoute exact path="/account-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/account-create">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountCreate />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/notfound">
                            <NotFound /></PrivateRoute>


                        <PrivateRoute exact path="/organizing-details/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrganizingEventDetails />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/organized-details/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrganizedEventDetails />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/notification">
                            <Suspense fallback={<LoadingScreen />}>
                                <Notification />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/evaluation-form">
                            <Suspense fallback={<LoadingScreen />}>
                                <EvaluationForm />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/product-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <ProductList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/category-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <CategoryList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/news-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <NewsList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/order-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrderList />
                            </Suspense>
                        </PrivateRoute>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >
    )

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/login">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/news-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/reset-password/:id">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-create">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-approved">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-reject">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-detail/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/event-edit/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/organizing-event">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/organized-event">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/account-create">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/organizing-details/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/organized-details/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/notification">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/evaluation-form">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/product-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/category-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/profile">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/order-list">
                        <DefaultContainer />
                    </Route>

                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;
