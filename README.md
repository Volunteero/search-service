# Search Service  
Provides search functionalities
## Internal  
Build with `express` and `mongoose`   
## Hosting  
Hosted on Heroku as `volunteero-search`: https://volunteero-search.herokuapp.com/api/v1/search
## Routes  

**POST**: ``/create``  
To index a new entity

Example request body for indexing an organization / event / campaign. You can send more than one if needed and also different types. Although probably not needed in the entitiy per service case.    
```json
{
	"entities": [
		{
			"name":"<name: string>",
			"description":"<description: string>",
			"id":"<id: string>",
			"influencePoints":"<influencePoints: number>",
			"organizationId":"<organizationId: string>",
		},
		{
			"id":"<id: string>",
			"name":"<name: string>",
			"description":"<description: string>",
			"start":"<start: string>",
			"end":"<end: string>",
			"location":"<location: string>",
			"category":"<category: string>",
			"organization_id":"<organization_id: string>",
			"points":"<points: number>",
			"volunteers":"<volunteers: number>",
			"available":"<available: boolean>",
		},
		{
			"id": "<:string>",
			"user_id": "<:string>",
			"organization_name": "<:string>",
			"organization_description": "<:string>",
			"influencePoints": ["<points: number>"],
			"campaign_ids": ["<campaign_id: string>"],
		}
	]
}
``` 
### Response: 200 OK / 400 BadRequest (check response body for errors)

---

**POST**: ``/update``

To update an exsistng entity.

Example request body:  the same as when creating, only id is required, everything else is optional depending on what was updated.

### Response 200 OK / 400 BadRequest (check response body for errors)

---

**DELETE**: ``/delete``

To unindex an entity. 

Example request body: the same as when creating, only id is required.

### Response 200 OK / 400 BadRequest (check response body for errors)

---

**GET**: ``/``

For searching documents.

Query string params: 

* type - type of entity ['event', 'campaign', 'organization', 'any']
* keyword - a comma separated list of keywords <br>

**``https://volunteero-search.herokuapp.com/api/v1/search?type=any&keyword=quick,test,hello``**

### Response 200 OK
```json
{ 
	"events": [], 
	"campaigns": [], 
	"organizations": [] 
}
```