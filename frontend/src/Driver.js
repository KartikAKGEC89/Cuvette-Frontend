import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';


const driverObj = new driver({
  showProgress: true, 
  arrowColor: '#ff0000', 
  opacity: 0.7, 
  padding: 10,

  
  steps: [
    {
      element: 'h1', 
      popover: {
        title: 'Welcome to Pocket Notes',
        description: 'This is web app for creating group notes and share them',
        position: 'right',
      },
    },
    {
      element: 'button',
      popover: {
        title: 'Create a Group',
        description: 'Click this button to create a new group for your notes.',
        position: 'bottom',
      },
    },
    {
      element: '#groupList',
      popover: {
        title: 'Groups List',
        description: 'Here you can see all your groups. Click on a group to view or create notes in particular group.',
        position: 'top',
      },
    },
    {
      element: '#backgroundImage',
      popover: {
        title: 'Background Image & Info',
        description: 'This section provides additional information and a background image.',
        position: 'left',
      },
    },
  ],
});


const startTour = () => {
  driverObj.drive(); 
};

export default startTour;