# Chores

This a repo containing a client and server to keep track of chores done.
This was created for me to try out GraphQL and front end development.

TODO:
client:
 * make contributions more responsive
 * how to handle timezones?
 * sections for buttons and data vis?
 * displays:
  * allow user to enter their own chores
  * show list of users chores (&points per chore?)
 * data vis:
  * graphs of contributions over time
   * points per day
   * when certain chores are done

server:
 * might be more efficient to convert to time to date when sent to the 
   server rather than converting each to a date 
 * connect db

calendar:
 * Each day is a square
  * colour is # points normalised into batches of 4
   * If bottom = light grey
   * If top = dark blue
   * If not in month = white
  * hover over for number of points
 * Shows months present in data