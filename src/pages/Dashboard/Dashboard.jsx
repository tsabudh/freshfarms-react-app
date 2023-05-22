import Ticket from "../../components/Ticket/Ticket";

const Dashboard = () => {

    return(
        <div className="dashboard">
            <div className="sidebar"></div>
            <div className="window">
                <Ticket/>
            </div>
        </div>
    )

}
export default Dashboard;