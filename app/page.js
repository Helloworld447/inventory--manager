"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] =
    useState(" "); /*Replacement for searchQuery and setSearchQuery*/
  const [filteredItems, setfilteredItems] = useState([]);

  const filteredPantry = inventory.filter((item) => {
    return item.name.toLowerCase().includes(itemName.toLowerCase());
  });

  /*Updating the inventory*/
  const updateInventory = async () => {
    //The "Async" means that it won't block our code when it's fetching. Otherwise, the entire site will freeze when fetching
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  /*Adding an item to the inventory*/
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /*TUTORIAL UPDATE*/
  useEffect(() => {
    if (itemName) {
      const filtered = inventory.filter((item) =>
        item.name.toLowerCase().includes(itemName.toLowerCase())
      );
      setfilteredItems(filtered);
    } else {
      setfilteredItems(inventory);
    }
  }, [itemName, inventory]);

  console.log(inventory);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      gap={2}
      padding={4}
      sx={{ bgcolor: "#F9F3E3" }} // Set the background color here#bae5c1
    >
      <Typography
        variant="h1"
        sx={{ fontSize: "3rem", marginBottom: "2rem", color: "#FC6A03" }}
      >
        Master Inventory
      </Typography>

      <TextField
        variant="outlined"
        label="Search Pantry "
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        sx={{
          width: "60%",
          maxWidth: "600px",
          marginBottom: "1rem",
          borderRadius: 0.5,
          "&:hover": { bgcolor: "#efefef", borderColor: "orange" }, // Change background color on hover
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "solid", // Default border
            },
            "&:hover fieldset": {
              borderColor: "orange", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "orange", // Border color when focused
            },
          },
          "& .MuiInputBase-input": {
            fontWeight: "bold",
            paddingTop: "16px",
            paddingLeft: "8px", // Adjust padding to move text left
          },
          "& .MuiInputLabel-root": {
            color: "#fc6a03", // Change label color to orange#0f52ba
            "&.Mui-focused": {
              color: "#FC6A03", // Change label color when focused
            },
          },
        }}
        InputLabelProps={{
          style: {
            fontSize: "1.1rem",
            marginBottom: "8px",
          }, // Make label bold
        }}
      />

      <Button
        variant="contained"
        sx={{
          bgcolor: "#DC0600",
          "&:hover": { bgcolor: "#CC0600" },
          marginBottom: "2rem",
        }}
        onClick={handleOpen}
      >
        Add New Item
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6"> Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              sx={{ width: 800 }}
              variant="outlined"
              label="Search Pantry for Items"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName(" ");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        sx={{
          width: "80%",
          maxWidth: "800px",
          bgcolor: "#D3D3D3",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Box sx={{ bgcolor: "#FCA510", color: "white", display: "flex", p: 2 }}>
          <Typography sx={{ flex: 1, color: "#4E3B31", fontWeight: "bold" }}>
            Items
          </Typography>
          <Typography
            sx={{
              flex: 1,
              textAlign: "center",
              color: "#4E3B31",
              fontWeight: "bold",
            }}
          >
            Quantity
          </Typography>
          <Typography
            sx={{
              flex: 1,
              textAlign: "right",
              color: "#4E3B31",
              fontWeight: "bold",
            }}
          >
            Edit
          </Typography>
        </Box>
        <Stack spacing={1} sx={{ p: 1 }}>
          {filteredItems.map(({ name, quantity }) => (
            <Box
              key={name}
              sx={{
                bgcolor: "#FEFEFA",
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: "4px",
              }}
            >
              <Typography sx={{ flex: 1, color: "#4E3B31" }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                sx={{ flex: 1, textAlign: "center", color: "#4E3B31" }}
              >
                {quantity}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#2c7737" } }}
                >
                  ADD
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => removeItem(name)}
                  sx={{
                    color: "red",
                    borderColor: "red",
                    "&:hover": {
                      bgcolor: "#F44336",
                      color: "white",
                      borderColor: "red",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      <p style={{ color: "#4E3B31", marginTop: "50px", fontSize: "12px" }}>
        &copy; 2024 Nidu Rahubedde | v1.1.0
      </p>
    </Box>
  );
}
