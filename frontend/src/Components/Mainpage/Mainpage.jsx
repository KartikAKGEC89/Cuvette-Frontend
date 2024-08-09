
import React, { useEffect, useRef, useState } from 'react'
import styles from './Mainpage.module.css'
import CreateGroup from '../Createnote/CreateGroup';
import CreateNotes from '../Createnote/Createnote';
import bg from '../../Assets/MainImage.png';
import lock from '../../Assets/Lock.png';
import axios from 'axios';

const Mainpage = () => {
  const [showComponent,setShowComponent]=useState(false);
  const [groups,setGroups]=useState([]);
  const [selectedGroup,setSelectedGroup]=useState(null);
  const groupsConatinerRef=useRef(null);
  const createGroupRef = useRef(null); 

  useEffect(()=>{
    const fetchGroups = async () => {
      try {
        const response = await axios.get("https://cuvette-backend-m2dm.onrender.com/groups/all");
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  },[])

  

  useEffect(()=>{
    if(groupsConatinerRef.current){
      const height=groupsConatinerRef.current.scrollHeight;
      groupsConatinerRef.current.style.height=`${height}px`;
    }
  },[groups])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createGroupRef.current && !createGroupRef.current.contains(event.target)) {
        setShowComponent(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleSaveGroup= async (groupData)=>{
    
    try {
      const response = await axios.post("https://cuvette-backend-m2dm.onrender.com/groups/create", groupData);
      const newGroup = response.data.group;
      setGroups(prevGroups => [...prevGroups, newGroup]);
    } catch (error) {
      console.error('Error saving group:', error);
    }
  }

  const handleGroupClick=(group)=>{
    const newSelectedGroup = {
      ...group,
      groupid: group._id,
    };
    setSelectedGroup(newSelectedGroup);
  }

  const handleClick=()=>{
    setShowComponent(!showComponent);
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.left} ${selectedGroup ? styles.hidden : styles.visible}`}>
        <h1>Pocket Notes</h1>
        <button onClick={handleClick}>+</button>
        {showComponent && (
          <div ref={createGroupRef}>
            <CreateGroup onSave={handleSaveGroup}/>
          </div>
        )}
        <div className={styles.groupscontainer} ref={groupsConatinerRef}>
          {groups.map((group,index)=>{
            return (
              <div key={index} onClick={()=>{handleGroupClick(group)}}>
                <button className={styles.groupcolor} style={{backgroundColor:group.color}}>{group.name ? group.name.slice(0,2) : 'N/A'}</button>
                <span>{group.name}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className={`${styles.right} ${selectedGroup ? styles.visible : styles.hidden}`}>
        {selectedGroup && <CreateNotes selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />}
        {!selectedGroup && (
          <>
            <img className={styles.bg} src={bg} alt="bgimage" />
            <div className={styles.bgcontent}>
              <h1>Pocket Notes</h1>
              <p>Send and receive messages without keeping your phone online.<br/>
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"24px", marginTop:"100px"}}>
              <img src={lock} alt="Encryption" />
              <h5>end-to-end encrypted</h5>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Mainpage;