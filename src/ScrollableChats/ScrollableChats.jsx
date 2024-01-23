import React from 'react'

const ScrollableChats = ({isOriginalSender,name,time,pic,message}) => {
    if(isOriginalSender){
     return   <div  className="msg right-msg">
               
        <div
          className="msg-img"
          style={{ backgroundImage: `url(${pic})` }}
        ></div>

        <div className="msg-bubble">
          <div className="msg-info">
            <div className="msg-info-name">{name}</div>
            <div className="msg-info-time">{time}</div>
          </div>

          <div className="msg-text">{message}</div>
        </div>
      </div>
    }
  return (
    <div className="msg left-msg">
               
                <div
                  className="msg-img"
                  style={{
                    backgroundImage:
                    !pic?  "url(https://media.istockphoto.com/id/1702122946/photo/3d-halloween-green-monster-icon-traditional-element-of-d%C3%A9cor-for-halloween-icon-isolated-on.webp?b=1&s=170667a&w=0&k=20&c=gyaXvCexYYm5AOme1-qlPFF6DBajUC02sm3UPorTfyE=)":
                    `url(${pic})`
                  }}
                ></div>

                <div className="msg-bubble">
                  <div className="msg-info">
                    <div className="msg-info-name">{name}</div>
                    <div className="msg-info-time">{time}</div>
                  </div>

                  <div className="msg-text">{message}</div>
                </div>
              </div>
        
          
          
  )
}

export default ScrollableChats
