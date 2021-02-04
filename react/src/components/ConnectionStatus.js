import {useSelector} from "react-redux";
import styled from 'styled-components'

const StatusCircle = styled.div`
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    margin-top: 0.2rem;
    margin-right: 0.7rem;
`;

const RedCircle = styled(StatusCircle)`
    background: red;
`;

const GreenCircle = styled(StatusCircle)`
    background: #008000a3;
`;

const mapState = state => state.connection;

function ConnectionStatus({className}){
    const {connected} = useSelector(mapState);

    return <div className={className}>
        {
            connected ?
                <><GreenCircle/> Connected</>
                :
                <><RedCircle/> Disconnected</>
        }
    </div>
}

export default styled(ConnectionStatus)`
    display: flex;
    position: absolute;
    right: 2rem;
    top: 1rem;
    padding: 0.5rem 1rem 0.5rem 1rem;
    background: white;
    border-radius: 5px;
`;