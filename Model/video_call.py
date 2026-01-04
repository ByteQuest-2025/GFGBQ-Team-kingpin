import cv2
import socket
import pickle
import struct

# Configuration
PORT = 8080

def receive_camera_stream():
    """Starts the Hospital side receiver."""
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Allow port reuse to prevent 'Address already in use' errors during rapid testing
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        server_socket.bind(('0.0.0.0', PORT))
        server_socket.listen(5)
        print(f"[LISTENING] Waiting for Ambulance on port {PORT}...")

        conn, addr = server_socket.accept()
        print(f"[CALL RECEIVED] Incoming from {addr}")

        data = b""
        payload_size = struct.calcsize("Q")

        while True:
            while len(data) < payload_size:
                packet = conn.recv(4096)
                if not packet: break
                data += packet
            
            if not data: break

            packed_msg_size = data[:payload_size]
            data = data[payload_size:]
            msg_size = struct.unpack("Q", packed_msg_size)[0]

            while len(data) < msg_size:
                data += conn.recv(4096)
            
            frame_data = data[:msg_size]
            data = data[msg_size:]
            
            frame = pickle.loads(frame_data)
            cv2.imshow('HOSPITAL - REMOTE AMBULANCE FEED', frame)
            
            # Press 'q' on the video window to hang up
            if cv2.waitKey(1) == ord('q'):
                break
    except Exception as e:
        print(f"[VIDEO ERROR] {e}")
    finally:
        conn.close()
        server_socket.close()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    receive_camera_stream()