# ConferenceApp API Backend

Fast and light web server to manage mobile app requests. This API allows mobile users to manage their user accounts, get information about scheduled conferences in the specific city and share emotions about visited events. All responses are in json format.
Android companion app is avaliable [here.](https://github.com/dbulgakov/ConferenceApp)


## Avaliable API methods:
**Authentication:**
* **/POST** signup — User registration method.

	**Supported parameters**: username, password, first name, last name, email, personal description, photo id
* **/POST** login — Login for registred users to obtain auth token.

	**Supported parameters**: username, password.
	
**Conferences:**
* **/GET** conferences — Get all scheduled conferences.

	**Supported parameters**: n/a
* **/GET** conferences/id — Get information about specific conference.

	**Supported parameters**: conference id
* **/POST** conferences/id/attend — Add user into conference attendees list 

	**Supported parameters**: conference id, auth token
* **/POST** conferences/id/unattend — Removes user from conference attendees list 

	**Supported parameters**: conference id, auth token

**Speeches:**
* **/GET** speeches/id — Get information about specific speech.

	**Supported parameters**: speech id.
* **/GET** speeches/id/comments — Get all comments for a specific speech.

	**Supported parameters**: speech id
* **/POST** speeches/id/comments — Add new comments for a specific speech

	**Supported parameters**: speech id

**Users:**
* **/GET** users/id — Get information about specific user.

	**Supported parameters**: user id.

**Images:**
* **/GET** images/id — Get image by id.

	**Supported parameters**: image id.

## Technologies:
This RESTful API is powered by stack of NodeJS, Express and MS SQL.
