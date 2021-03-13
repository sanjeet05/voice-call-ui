import React, { Component, Fragment } from "react";
import Countdown, { zeroPad } from "react-countdown";

// socket
import socketIOClient from "socket.io-client";

// actions
import { doPlivoCall } from "../../actions/voiceActions";

// form
import CallForm from "./CallForm";

// css
import "./Home.scss";

const socket_url = process.env.REACT_APP_BASE_API_URL;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: {},
      serverError: "",
      isLoading: false,
      isTimerStart: true,
      startTimer: 0,
      phoneNumber: "",
    };
  }

  // open socket
  handleSocket = () => {
    const socket = socketIOClient(socket_url, {
      transports: ["websocket"],
      upgrade: false,
    });

    socket.on("connect_error", (err) => {
      console.log("socket connection error");
    });

    socket.on("error", (err) => {
      console.log("socket auth error: ", err);
    });

    socket.on("connect", () => {
      console.log("socket connected...");
      // console.log("socket_id: ", socket.id);
    });

    socket.on("subscribeToNotification", (data) => {
      // console.log("socket_data", data);
      const { phoneNumber } = this.state;
      if (data && data.from) {
        if (data.phoneNumber === phoneNumber) {
          //  stop timer
          this.setState({ isTimerStart: true });
        }
      }
    });
  };

  // close socket
  handleCloseSocket = () => {
    const { socket } = this.state;
    socket.off("subscribeToNotification");
    socket.disconnect();
  };

  componentDidMount() {
    this.handleSocket();
  }

  componentWillUnmount() {
    this.handleCloseSocket();
  }

  handleSubmit = async (values) => {
    try {
      this.setState({ isLoading: true, serverError: "" });
      const res = await doPlivoCall(values);
      const waitTime = parseInt(res.duration) * 60000;
      this.setState({
        isLoading: false,
        phoneNumber: values.from,
        isTimerStart: false,
        startTimer: Date.now() + waitTime,
      });
    } catch (error) {
      this.setState({ isLoading: false, serverError: error.message });
    }
  };

  render() {
    const { serverError, isLoading, isTimerStart, startTimer } = this.state;

    return (
      <Fragment>
        <section id="home">
          <div className="container">
            <div className="row mt-5 mb-4">
              <div className="col-md-3"></div>
              <div className="col-md-6 card p-3">
                <CallForm
                  handleSubmit={this.handleSubmit}
                  isLoading={isLoading}
                  isDisable={!isTimerStart}
                />
                <div>
                  {!isTimerStart && (
                    <Countdown
                      date={startTimer}
                      renderer={(props) => (
                        <span className="timer">
                          {zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                        </span>
                      )}
                      onComplete={(isCompleted) => this.setState({ isTimerStart: isCompleted })}
                    />
                  )}
                </div>
              </div>
              <div className="col-md-3"></div>
            </div>

            {serverError && <div className="text-danger mt-2 mb-2 text-center">{serverError}</div>}
          </div>
        </section>
      </Fragment>
    );
  }
}

export default Home;
