import TicketPane from "../../components/TicketPane/TicketPane";

const Dashboard = () => {

    return(
        <div className="dashboard">
            <div className="sidebar"></div>
            <div className="window">
                <TicketPane/>
            </div>
        </div>
    )

}
export default Dashboard;