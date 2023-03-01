import React, { useState, useRef } from 'react'
import './Home.css'

function Home() {
    const [money, setMoney] = useState("");
    const [showMoney, setShowMoney] = useState(false);
    const [allNoteCount, setAllNoteCount] = useState(new Array(3).fill(0));
    const timerCount = 30;
    const [timer, setTimer] = useState(timerCount);
    const cashCollectInterval = useRef();
    const allNotes = [20, 50, 100];

    //Handle amount change
    const onInputChange = ({ value }) => {
        setMoney(value)
    }

    //On submitting withdrawal amount
    const onSubmit = () => {
        clearInterval(cashCollectInterval.current);
        setTimer(timerCount)
        cashCollectInterval.current = undefined

        let value = Number(money)
        if (!value) {
            alert("Please enter valid value")
            return;
        }
        if (value % 10 !== 0) {
            alert('Please enter money multiple of 10 (except 10 and 30)')
            return;
        }
        else if (value < 0 || value === 10 || value === 30) {
            alert('Money should be greater than 0 or != 10 or != 30')
            return;
        }
        else if (value > 10000000) {
            alert('Maximum cash with-drawal limit is 10000000 (1 Crore)')
            return;
        }

        cashCollectTimer();
        countNotes(value);
    }

    //Counts number of specific notes
    const countNotes = (value) => {
        let tmpValue = value, tmpArr = [0, 0, 0];

        if (tmpValue % 100 === 0) { //For 100,200,5000,100000
            let divValue = tmpValue / 100
            tmpValue = tmpValue - (divValue * 100)
            tmpArr[2] = divValue
        }
        else if (tmpValue % 50 === 0) { //For 150,250,5500,500050
            tmpValue = tmpValue - 50;
            if (tmpValue % 100 === 0) {
                let divValue = tmpValue / 100
                tmpValue = tmpValue - (divValue * 100)
                tmpArr[2] = divValue
                tmpArr[1] = 1
            }
        }
        else if (tmpValue < 100 && tmpValue % 20 === 0) {   //For <100 && 20,40,60,80
            let divValue = tmpValue / 20
            tmpValue = tmpValue - (divValue * 20)
            tmpArr[0] = divValue
        }
        else {  //For 110,120,130,170,830,90010,9000090
            let cnt = 0;
            while (tmpValue > 0) {
                tmpValue = tmpValue - 20;
                cnt += 1;
                if (tmpValue % 100 === 0) {
                    let divValue = tmpValue / 100
                    tmpValue = tmpValue - (divValue * 100)
                    tmpArr[2] = divValue
                    tmpArr[0] = cnt
                }
                else if (tmpValue % 50 === 0) {
                    tmpValue = tmpValue - 50
                    tmpArr[1] = 1
                    tmpArr[0] = cnt
                    if (tmpValue % 100 === 0) {
                        let divValue = tmpValue / 100
                        tmpValue = tmpValue - (divValue * 100)
                        tmpArr[2] = divValue
                        // tmpArr[0] = cnt
                    }
                }
            }
        }

        setAllNoteCount([...tmpArr])
    }

    //30 Sec timer to collect cash
    const cashCollectTimer = () => {
        setShowMoney(true)
        cashCollectInterval.current = setInterval(() => {
            setTimer(prev => {
                if (prev - 1 === 0) {
                    setShowMoney(false)
                    clearInterval(cashCollectInterval.current);
                    setTimer(timerCount)
                }
                return prev - 1;
            })

        }, 1000)
    }

    //Clear cashCollectTimer when cash collected
    const onCollectCash = () => {
        clearInterval(cashCollectInterval.current);
        cashCollectInterval.current = undefined
        setTimer(timerCount)
        setShowMoney(false)
        setMoney("")
    }

    return (
        <div className='homeWrapper'>
            <span className='headerText'>ATM Money Checker</span>

            <div className='inputDiv'>
                <div className='innerDiv'>
                    <input value={money} onChange={e => onInputChange(e.target)} type='number' autoFocus />
                    <button onClick={onSubmit}>Subumit</button>
                </div>
            </div>

            {
                showMoney &&
                <div className='imgWrapper'>
                    <div className='innerImgDiv'>
                        <div>
                            <img src={require('../../image/20_INR.jpg')} alt="20 Rs note" width="200px" height="100px" />
                            <span className='multiplier'>X</span>
                            <span className='noteCount'>{allNoteCount[0]}</span>
                            <span>{allNotes[0] * allNoteCount[0]}</span>
                        </div>
                        <div>
                            <img src={require('../../image/50_INR.jpg')} alt="50 Rs note" width="200px" height="100px" />
                            <span className='multiplier'>X</span>
                            <span className='noteCount'>{allNoteCount[1]}</span>
                            <span>{allNotes[1] * allNoteCount[1]}</span>
                        </div>
                        <div>
                            <img src={require('../../image/100_INR.png')} alt="100 Rs note" width="200px" height="100px" />
                            <span className='multiplier'>X</span>
                            <span className='noteCount'>{allNoteCount[2]}</span>
                            <span>{allNotes[2] * allNoteCount[2]}</span>
                        </div>
                    </div>
                    <p style={{ color: 'red' }}>{`Hurry up!!! Collect cash with in ${timer} seconds`}</p>
                    <button onClick={onCollectCash}>Collect Cash</button>
                </div>
            }
        </div>
    )
}

export default Home