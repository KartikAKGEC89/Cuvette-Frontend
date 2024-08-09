import React, { useState } from 'react'
import styles from './CreateGroup.module.css'

function CreateGroup({onSave}) {
  const colors=['#B38BFA','#FF79F2','#43E6FC','#F19576','#0047FF','#6691FF'];
  const [groupName,setGroupName]=useState('');
  const [selectedColor,setSelectedColor]=useState('');

  const handleCreateGroup=()=>{
    if(!groupName.trim()){
      alert('Please enter a group name');
      return;
    }
    if(!selectedColor){
      alert('Please choose a color');
      return;
    }
    const groupData={name:groupName,color:selectedColor};
    // localStorage.setItem('groups',JSON.stringify(groupData));
    onSave(groupData);
    setGroupName('');
    setSelectedColor('');

  }

  return (
    <div className={styles.creategroup}>
      <h2>Create New Group</h2>
      <div className={styles.gn}>
        <label htmlFor="groupName">Group Name:</label>
        <input type="text" id='groupName' placeholder='Enter group name' value={groupName} onChange={(e)=>{setGroupName(e.target.value)}} />
      </div>
      <p>Choose colour:
        {colors.map((currColor,index)=>{
          return <button key={index} className={`${styles.btn} ${selectedColor===currColor?styles.selected:''}`}  style={{backgroundColor:currColor}} onClick={()=>{setSelectedColor(currColor)}}></button>
      })}
      </p>
      <div>
        <button className={styles.create} onClick={handleCreateGroup}>Create</button>
      </div>
    </div>
  )
}

export default CreateGroup;