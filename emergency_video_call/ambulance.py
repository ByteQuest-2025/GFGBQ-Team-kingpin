import cv2
import socket
import pickle
import struct
import threading

TARGET_IP = '127.0.0.1' 
PORT = 8080

def start_camera_stream():
    """Captures webcam and sends frames to the target."""
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect((TARGET_IP, PORT))
        print(f"[CONNECTED] Streaming to {TARGET_IP}")
    except:
        print("[ERROR] Could not connect. Ensure the other side is 'Listening'.")
        return

    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break
        
        data = pickle.dumps(frame)
        message = struct.pack("Q", len(data)) + data
        
        try:
            client_socket.sendall(message)
        except:
            break

        cv2.imshow('AMBULANCE - YOUR FEED', frame)
        if cv2.waitKey(1) == ord('q'):
            break
            
    cap.release()
    client_socket.close()

def receive_camera_stream():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('0.0.0.0', PORT))
    server_socket.listen(5)
    print(f"[LISTENING] Waiting for incoming call on port {PORT}...")

    conn, addr = server_socket.accept()
    print(f"[CALL RECEIVED] Incoming from {addr}")

    data = b""
    payload_size = struct.calcsize("Q")

    while True:
        try:
            while len(data) < payload_size:
                packet = conn.recv(4096)
                if not packet: break
                data += packet
            
            packed_msg_size = data[:payload_size]
            data = data[payload_size:]
            msg_size = struct.unpack("Q", packed_msg_size)[0]

            while len(data) < msg_size:
                data += conn.recv(4096)
            
            frame_data = data[:msg_size]
            data = data[msg_size:]
            
            frame = pickle.loads(frame_data)
            cv2.imshow('HOSPITAL - REMOTE FEED', frame)
            
            if cv2.waitKey(1) == ord('q'):
                break
        except:
            break
            
    conn.close()
    server_socket.close()

if __name__ == "__main__":
    choice = input("Enter '1' to Listen (Hospital) or '2' to Call (Ambulance): ")
    
    if choice == '1':
        receive_camera_stream()
    else:
        start_camera_stream()