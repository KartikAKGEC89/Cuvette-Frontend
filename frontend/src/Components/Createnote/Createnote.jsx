import React, { useEffect, useRef, useState } from 'react';
import styles from './Createnote.module.css';
import vector from '../../Assets/Vector.png';
import backarrow from '../../Assets/Back.png';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Function to parse date in the format '9 Aug 2024'
const parseDateString = (dateString) => {
  return new Date(dateString);
};

function CreateNotes({ selectedGroup, setSelectedGroup }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    let timeOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const newNotes = {
      content: newNote,
      date: selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', timeOptions),
      groupId: selectedGroup._id, 
    };
    handleSaveNote(newNotes);
    setNewNote('');
  };

  const handleSelect = () => {
    setSelectedGroup(null);
  };

  const formatDateToString = (date) => {
    // Format date to '9 Aug 2024'
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredNotes = notes.filter(note => {
    const noteDate = parseDateString(note.date);
    const selectedDateString = formatDateToString(selectedDate);
    return formatDateToString(noteDate) === selectedDateString;
  });

  return (
    <div>
      <div className={styles.header}>
        <img className={styles.arrow} src={backarrow} alt='back' onClick={handleSelect}/>
        <button className={styles.groupcolor} style={{ backgroundColor: selectedGroup?.color }}>
          {selectedGroup?.name.slice(0, 2)}
        </button>
        <span className={styles.heading}>{selectedGroup?.name}</span>
      </div>
      <div className={styles.datePickerContainer}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="d MMM yyyy"
          className={styles.datePicker}
        />
      </div>
      <div className={styles.notesContainer} ref={notesContainerRef}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
            <div key={index} className={styles.notes}>
              {note.content}
              <br />
              <br />
              <span>{note.date} &middot; {note.time}</span>
            </div>
          ))
        ) : (
          <div className={styles.noNotes}>No notes for selected date</div>
        )}
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