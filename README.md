# Chores

This a repo containing a client and server to keep track of chores done.
This was created for me to try out GraphQL and front end development.

TODO:
client:
 * sections for buttons and data vis?
 * displays:
  * allow user to enter their own chores
  * show list of users chores (&points per chore?)
 * data vis:
  * contributions a la github
  * graphs of contributions over time
   * points per day
   * when certain chores are done

server:
 * connect db

calendar:
 * Each day is a square
  * colour is # points normalised into batches of 4
   * If bottom = light grey
   * If top = dark blue
   * If not in month = white
  * hover over for number of points
 * Shows months present in data