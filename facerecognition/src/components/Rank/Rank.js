import React from 'react';

const Rank = ({name, entries}) => {
    return (
        <div>
            <div className='black f3 textcolor' style={{color:'#d4d4dc'}}>
            {`${name} , your current entry count is...`}
            </div>
            <div className='black f1' style={{color:'#d4d4dc'}}>
            {entries}
            </div>
        </div>
    );
}

export default Rank;