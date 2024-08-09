import React, { useEffect, useRef, useState } from 'react';
import styles from './Createnote.module.css';
import vector from '../../Assets/Vector.png';
import axios from 'axios';

function CreateNotes({ selectedGroup }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const notesContainerRef = useRef(null);

  useEffect(() => {
     const fetchNotes = async () => {
      try {
        const response = await axios.get(`https://cuvette-backend-m2dm.onrender.com/notes/all/${selectedGroup._id}`);
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    if (selectedGroup && selectedGroup._id) {
      fetchNotes();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (notesContainerRef.current) {
      const height = notesContainerRef.current.scrollHeight;
      notesContainerRef.current.style.height = `${height}px`;
    }
  }, [notes]);

  const handleSaveNote = async (Note) => {
    try {
      const response = await axios.post("https://cuvette-backend-m2dm.onrender.com/notes/create", Note);
      console.log(response.data);
      const newNote = response.data.note;
      setNotes(prevNotes => [...prevNotes, newNote]);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleClickNote = () => {
    const trimmedNote = newNote.trim();
    if (!trimmedNote) {
      return;
    }
    let dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    let timeOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const newNotes = {
      content: newNote,
      date: new Date().toLocaleString('en-GB', dateOptions),
      time: new Date().toLocaleTimeString('en-US', timeOptions),
      groupId: selectedGroup._id, 
    };
    handleSaveNote(newNotes);
    setNewNote('');
  };
  const selectedGroupNotes = notes.filter(note => note.groupId === selectedGroup._id);

  
  return (
    <div>
      <div className={styles.header}>
        <button className={styles.groupcolor} style={{ backgroundColor: selectedGroup?.color }}>
          {selectedGroup?.name.slice(0, 2)}
        </button>
        <span className={styles.heading}>{selectedGroup?.name}</span>
      </div>
      <div className={styles.notesContainer} ref={notesContainerRef}>
        {selectedGroupNotes.map((note, index) => (
          <div key={index} className={styles.notes}>
            {note.content}
            <br />
            <br />
            <span>{note.date} {note.time}</span>
          </div>
        ))}
      </div>
      <div className={styles.writenotes}>
        <input
          type="text"
          placeholder='Enter your text here...........'
          value={newNote}
          onChange={(e) => { setNewNote(e.target.value); }}
        />
        {newNote.trim() ? (
          <img src={vector} alt="vector" className={styles.vector} onClick={handleClickNote} />
        ) : (
          <img src={vector} alt="vector" className={styles.vector} onClick={handleClickNote} style={{ opacity: 0.5 }} />
        )}
      </div>
    </div>
  );
}

export default CreateNotes;