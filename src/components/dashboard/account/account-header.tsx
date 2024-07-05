'use client';

import React, { useEffect, useState } from 'react';
import { CameraIcon } from '@/icons';
import styled from '@emotion/styled';
import { Avatar, Box, IconButton as MuiIconButton, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';
import { userApis } from '@/lib/user/userApis';
import { Button } from '@/components/commun/Button';
import { IconButton } from '@/components/commun/Button/IconButton';

const CoverImage = styled(Box)({
  height: '200px',
  backgroundImage: 'url(https://source.unsplash.com/random)', // Replace with placeholder or selected image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  borderRadius: '16px',
});

const ProfilePicture = styled(Avatar)({
  width: '160px',
  height: '160px',
  border: '3px solid white',
  top: '-50px',
  left: '20px',
});

const iconButtonStyle = {
  width: '45px', // custom width
  height: '45px', // custom height
  '& .MuiSvgIcon-root': {
    fontSize: '40px', // custom icon size
  },
  border: '3px solid white',
  bottom: '-70px',
  left: '-30px',
};

interface ProfileHeaderProps {
  sx?: any;
}

const ProfileHeader = ({ sx }: ProfileHeaderProps) => {
  const { user } = useSelector((state: any) => state.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageProfil, setSelectedImageProfil] = useState(null);
  const dispatch = useDispatch();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    console.log(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('id', user.id);
      formData.append('image', file);

      // Use FileReader to set the preview
      const reader = new FileReader();
      reader.onload = (e) => {
        type === 'COVER'
          ? setSelectedImage(e.target.result as string)
          : setSelectedImageProfil(e.target.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const { res, error } = await userApis.uploadImage(formData, user.id, type);

        if (error) {
          dispatch(setOpenToast({ message: error, type: 'error' }));
          return;
        }
        dispatch(setOpenToast({ message: 'Image Added Successfully', type: 'success' }));
      } catch (error) {
        dispatch(setOpenToast({ message: 'Error uploading image', type: 'error' }));
      }
    }
  };

  const handleClickCoverImage = () => {
    const fileInput = document.getElementById('cover-image-upload');
    if (fileInput) {
      fileInput.click(); // Simulate a click event on the file input
    }
  };

  const handleClickProfilImage = () => {
    const fileInput = document.getElementById('profil-image-upload');
    if (fileInput) {
      fileInput.click(); // Simulate a click event on the file input
    }
  };
  const getImage = React.useCallback(
    async (type: string): Promise<void> => {
      console.log('here upload');
      const { res, error } = await userApis.getImage(user._id, type);

      const blob = new Blob([res?.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      if (type === 'COVER') {
        setSelectedImage(imageUrl);
      } else {
        setSelectedImageProfil(imageUrl)
      }
      if (error) {
        dispatch(setOpenToast({ message: error, type: 'error' }));
        return;
      }

    },
    [user]
  );

  useEffect(() => {
    // console.log(user.coverImage);
    // setSelectedImage(user.coverImage);
    const fetchImages = async () => {
      await getImage('COVER');
      await getImage('PROFILE');
    };
    fetchImages();
  }, [user]);
  return (
    <Box sx={sx}>
      <CoverImage style={{ backgroundImage: `url(${selectedImage || 'https://source.unsplash.com/random'})` }}>
        <input
          accept="image/*"
          id="cover-image-upload"
          type="file"
          onChange={(e) => handleImageChange(e, 'COVER')}
          hidden
        />
        <Button
          variant="contained"
          btnType="primary"
          onClick={handleClickCoverImage}
          startIcon={<CameraIcon />}
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          Change Cover
        </Button>
      </CoverImage>
      <Box sx={{ display: 'flex' }}>
        <ProfilePicture
          src={selectedImageProfil || ''}
          alt={user.username}
          //style={{ backgroundImage: `url(${selectedImageProfil || 'https://source.unsplash.com/random'})` }}
          onClick={handleClickProfilImage}
        />
        <input
          accept="image/*"
          id="profil-image-upload"
          type="file"
          // onChange={handleProfilImageChange}
          onChange={(e) => handleImageChange(e, 'PROFILE')}
          hidden
          style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%' }} // Position and style the input
        />
        <IconButton onClick={handleClickProfilImage} btnType="primary" size="small" sx={iconButtonStyle}>
          <CameraIcon />
        </IconButton>

        <Box sx={{ marginLeft: '30px', marginTop: '20px' }}>
          <Typography variant="h3">{user.firstname + ' ' + user.lastname}</Typography>
          <Typography variant="body2">{user.email}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
