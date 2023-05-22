import styled from "styled-components";

const StyledTicketDiv = styled.div`
  display: flex;
  flex-basis: 2rem;
  justify-content: space-between;
  border: 1px solid blue;

  & .date-and-time{
  border: 1px solid red;

  & .time{
    font-size:2.5rem;
    font-weight:600;
  }
  }
`;

export default StyledTicketDiv;