import { useEffect, useContext } from 'react';

import { AppContext } from '../../context/AppContext';
import TopBar from '../topbar/TopBar';

import './Home.sass';

/*
    Setup:
        - Calling "yarn install" & "yarn start" should run this simple project.

    Task:

        - Show a list of things to be done on a table. Also, allow add, update, and delete operations on the list.
        - Use appService for retrieving the todo list from the server. The implementation of getToDoList function should not be touched.

    Responsibilities:

        1- Display: Show tasks to be done on the table.

        2- Sorting by column: Allow the user to click a button on the table header and order the rows in ascending or descending order by a particular column.

        3- Pagination: There could be many rows, paginate the results and provide a way to see all the pages. There can be a maximum of 10 tasks on each page.

        4- Filtering: Have an input box on top of the table to filter the rows by the content in a case-insensitive manner.

        5- Adding a new task: Have an input box and a button to add a new task to do. Initially, the task should have done_time = null. Each task should have a distinct ID.

        6- Marking a task as done: Allow the user to mark tasks as done. When a task is marked as done, change the text styling to strikethrough. Set the current time as done_time for that task.

        7- Marking a task as undone: Allow the user to mark the task as undone. When a task is undone, change the text styling back to normal and set done_time = null.

        8- Updating the task content: Allow the user to update task content with a button similar to the done/undone toggle above. The user should be able to change the content.

        9- Deleting a task: Allow the user to delete a task row on the table. This could be done via a button.

        10- Styling: Style the table, buttons, and controls as you wish to make it attractive enough. Do not worry about responsiveness.

    Bonus tasks:

        1- Adding/updating a new item: Instead of an input element and a button at the bottom of the table, manage the form inside a modal.

        2- Unit tests: Write unit tests to test the rendering process of the components.

        3- Typescript usage: Define TypeScript interfaces whenever necessary. All functions and arguments should be typed.
*/

const Home: React.FC = () => {
    const { leftBarShown, onToggleLeftBarShown } = useContext(AppContext);

    useEffect(() => {
        document.title = 'Tasks to do';

        if (!leftBarShown) {
            onToggleLeftBarShown(true);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <TopBar label="Tasks to do" />

            <div className="home">
                <div className="home-content">
                    - Content should be here -
                </div>
            </div>
        </div>
    )
};

export default Home;
