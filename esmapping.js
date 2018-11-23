{
	"youtube_entities": {
	 	"mappings": {
		 	"youtube_meta": {
			 	"properties": {
				 	"description": {
						"type": "string"
				 	},
				 	"thumbnail": {
						"type": "string"
				 	},
				 	"title": {
					 	"type": "string"
				 	},
				 	"transcript": {
					 	"type": "string"
				 	},
				 	"videoId": {
					 	"type": "string"
				 	},
				 	"entities": {
			            "type": "string"
		          	},
		          	"createdAt": {
            			"type": "long"
         			}
			 	}
		 	},
		 	"entities": {
			 	"properties": {
				 	"frequency": {
					 	"type": "long"
				 	},
				 	"videoId": {
			            "type": "string"
				 	},
				 	"text": {
					 	"type": "string"
				 	},
				 	"createdAt": {
            			"type": "long"
         			}
			 	}
		 	}
		}
 	}
}