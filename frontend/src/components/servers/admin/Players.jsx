import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText } from "@mui/material";
import { serverService } from "../../../services/serverService";

export const Players = ({ server }) => {
  const [loading, setLoading] = useState(true);
  const [activePlayers, setActivePlayers] = useState([]);
  const [bannedPlayers, setBannedPlayers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await serverService.getPlayers(server.id);
        setActivePlayers(res.active || []);
        setBannedPlayers(res.banned || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [server.id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        👥 Jugadores Activos
      </Typography>
      <Paper sx={{ mb: 3 }}>
        <List>
          {activePlayers.map((p, i) => (
            <ListItem key={i}>
              <ListItemText primary={p} />
            </ListItem>
          ))}
          {activePlayers.length === 0 && (
            <Typography sx={{ p: 2 }}>No hay jugadores activos</Typography>
          )}
        </List>
      </Paper>

      <Typography variant="h6" gutterBottom>
        🚫 Jugadores Baneados
      </Typography>
      <Paper>
        <List>
          {bannedPlayers.map((p, i) => (
            <ListItem key={i}>
              <ListItemText primary={p} />
            </ListItem>
          ))}
          {bannedPlayers.length === 0 && (
            <Typography sx={{ p: 2 }}>No hay jugadores baneados</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};
