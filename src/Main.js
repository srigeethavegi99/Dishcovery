// PostReview.js
import React, { useState, useEffect } from "react";
import { getDatabase, ref as dbref, push, get} from 'firebase/database'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, app } from "./firebase"; // Assuming you have initialized Firebase
import HalfRating from "./halfrating"; // Import the modified HalfRating component
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function CenteredTabs({ activeSection, handleSectionClick }) {
  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      handleSectionClick("post-review");
    } else if (newValue === 1) {
      handleSectionClick("read-reviews");
    }
  };

  return (
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={activeSection === "post-review" ? 0 : 1} onChange={handleChange} centered>
          <Tab label="Post Review" />
          <Tab label="Read Reviews" />
        </Tabs>
      </Box>
  );
}

function PostReview() {
  const [activeSection, setActiveSection] = useState("post-review");
  const [image, setImage] = useState(null);
  const [rating, setRating] = useState(2.5);
  const [description, setDescription] = useState("");
  const [foodName, setFoodName] = useState("");
  const [location, setLocation] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (activeSection === "read-reviews") {
      fetchReviews();
    }
  }, [activeSection]);

  const db = getDatabase(app)
  const db_ref = dbref(db, 'reviews')

  const fetchReviews = async () => {
    get(db_ref).then(snapshot=>{
      if(snapshot.exists()){
        const d_ata = snapshot.val()
        const keys = Object.keys(d_ata)
        const reviewData = []
        keys.forEach(key=> reviewData.push({...d_ata[key], id: key}))
        setReviews(reviewData)
      }else{
        setReviews([])
      }
    })
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // Check if file exists and is an image
    if (file && file.type.includes('image')) {
      setImage(file);
      setErrors({ ...errors, image: '' }); // Clear previous error
    } else {
      // Display error if file is not an image
      setImage(null); // Clear selected file
      setErrors({ ...errors, image: "Please select a valid image file." });
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSearchLocationChange = (event) => {
    setSearchLocation(event.target.value);
  };

  const handleSearch = () => {
    // Implement search functionality here
    // For example, you can filter reviews based on the searchLocation state
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!foodName) {
      setErrors({ ...errors, foodName: "Please enter the name of the food." });
      setIsSubmitting(false);
      return;
    }

    if (!image) {
      setErrors({ ...errors, image: "Please select an image to upload." });
      setIsSubmitting(false);
      return;
    }

    if (description.length === 0) {
      setErrors({ ...errors, description: "Please provide a description of your review." });
      setIsSubmitting(false);
      return;
    }

    try {
      const imageRef = ref(storage, `reviews/${image.name + Date.now()}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await push(db_ref, {
        imageUrl,
        foodName,
        rating,
        description,
        location,
        createdAt: new Date().toLocaleDateString(),
      });

      console.log("Review added successfully.");
      setImage(null);
      setRating(2.5);
      setDescription("");
      setFoodName("");
      setLocation("");
    } catch (error) {
      console.error("Error adding review:", error);
      setErrors({ ...errors, submit: "An error occurred while submitting your review." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleRefresh = () => {
    fetchReviews();
  };

  const filteredReviews = reviews.filter(review =>
      review.location?.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  return (
      <div style={{ position: 'relative' }}>
        <Typography variant="h4" style={{ color: '#000', marginBottom: '20px' }}>Foodiepal</Typography>
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '999' }}>
          <TextField
              label="Search Location"
              variant="outlined"
              size="small"
              value={searchLocation}
              onChange={handleSearchLocationChange}
              InputProps={{
                endAdornment: (
                    <IconButton onClick={handleSearch} size="small">
                      <SearchIcon />
                    </IconButton>
                )
              }}
          />
        </div>
        <CenteredTabs activeSection={activeSection} handleSectionClick={handleSectionClick} />

        {activeSection === "post-review" && (
            <div className="post-review">
              <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                <Typography variant="h5" gutterBottom>Post Review</Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <TextField
                          label="Food Name"
                          variant="outlined"
                          fullWidth
                          value={foodName}
                          onChange={handleFoodNameChange}
                          error={!!errors.foodName}
                          helperText={errors.foodName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <input type="file" onChange={handleImageChange} accept="image/*" />
                      {errors.image && <Typography variant="caption" color="error">{errors.image}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                      <HalfRating value={rating} readOnly={false} onChange={handleRatingChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                          label="Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          value={description}
                          onChange={handleDescriptionChange}
                          error={!!errors.description}
                          helperText={errors.description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                          label="Location"
                          variant="outlined"
                          fullWidth
                          value={location}
                          onChange={handleLocationChange}
                          InputProps={{
                            endAdornment: (
                                <LocationOnIcon style={{ color: '#757575' }} />
                            )
                          }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                      {errors.submit && <Typography variant="caption" color="error">{errors.submit}</Typography>}
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </div>
        )}

        {activeSection === "read-reviews" && (
            <div className="read-reviews">
              <h2>Read Reviews</h2>
              <button onClick={handleRefresh}>Refresh</button>
              {filteredReviews.length === 0 && <p>No reviews found.</p>}
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {filteredReviews.map((review) => (
                    <div key={review.id} style={{ margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <Typography variant="h6" gutterBottom>{review.foodName}</Typography>
                      </div>
                      <div>
                        <img src={review.imageUrl} alt="Review" style={{ width: '200px', height: '200px' }} />
                      </div>
                      <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <Typography variant="body1" gutterBottom>{review.description}</Typography>
                        <HalfRating value={review.rating} readOnly={true} />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon style={{ color: '#757575', marginRight: '5px' }} />
                          <Typography variant="caption" gutterBottom>{review.location}</Typography>
                        </div>
                        {review.createdAt && (
                            <Typography variant="caption" gutterBottom>Posted on: {review.createdAt}</Typography>
                        )}
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
}

export default PostReview;
