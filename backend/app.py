from flask import Flask, request, jsonify
import cv2
import numpy as np
import mediapipe as mp
import base64
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app, resources={r"/tryon": {"origins": "*"}})

# Initialize Mediapipe solutions
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose
face_mesh = mp_face_mesh.FaceMesh()
pose = mp_pose.Pose()

def base64_to_image(base64_string):
    """Convert base64 string to OpenCV image."""
    img_data = base64.b64decode(base64_string.split(',')[-1])
    np_arr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

def image_to_base64(image):
    """Convert OpenCV image to base64 string."""
    _, buffer = cv2.imencode('.jpg', image)
    return "data:image/jpeg;base64," + base64.b64encode(buffer).decode('utf-8')

def overlay_glasses(user_image, glasses_image, scale_factor=1.5):
    """Overlay glasses while keeping the user’s face and background intact."""
    
    # Convert to RGB for FaceMesh processing
    user_image_rgb = cv2.cvtColor(user_image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(user_image_rgb)

    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0]
        ih, iw, _ = user_image.shape
        
        # Get key landmarks for fitting glasses
        left_eye_outer = face_landmarks.landmark[33]   # Left eye outer corner
        right_eye_outer = face_landmarks.landmark[263] # Right eye outer corner
        left_eye_top = face_landmarks.landmark[159]    # Left eye top
        right_eye_top = face_landmarks.landmark[386]   # Right eye top
        nose_bridge = face_landmarks.landmark[168]     # Nose bridge
        
        # Compute eye width for scaling glasses
        eye_width = (right_eye_outer.x - left_eye_outer.x) * iw
        new_left_x = int((left_eye_outer.x * iw) - (eye_width * (scale_factor - 1) / 2))
        new_right_x = int((right_eye_outer.x * iw) + (eye_width * (scale_factor - 1) / 2))

        # Compute glasses height based on eye and nose position
        top_y = int(min(left_eye_top.y, right_eye_top.y) * ih - 15)
        bottom_y = int(nose_bridge.y * ih + 20)

        # Resize glasses to fit
        glasses_width = new_right_x - new_left_x
        glasses_height = bottom_y - top_y
        resized_glasses = cv2.resize(glasses_image, (glasses_width, glasses_height), interpolation=cv2.INTER_AREA)

        # Convert glasses image to BGRA if not already
        if resized_glasses.shape[2] == 3:  
            resized_glasses = cv2.cvtColor(resized_glasses, cv2.COLOR_BGR2BGRA)

        # **🔹 Fix: Preserve Background**
        # Create a copy of the original image
        original_background = user_image.copy()

        # Ensure user image is in BGRA
        if user_image.shape[2] == 3:
            user_image = cv2.cvtColor(user_image, cv2.COLOR_BGR2BGRA)

        # Ensure original background has the same shape
        if original_background.shape[2] == 3:
            original_background = cv2.cvtColor(original_background, cv2.COLOR_BGR2BGRA)

        # Extract alpha channel from glasses
        glasses_alpha = resized_glasses[:, :, 3] / 255.0
        user_alpha = 1.0 - glasses_alpha

        # Overlay glasses while keeping face and background
        for c in range(0, 3):  # Loop over RGB channels
            user_image[top_y:bottom_y, new_left_x:new_right_x, c] = (
                glasses_alpha * resized_glasses[:, :, c] +
                user_alpha * user_image[top_y:bottom_y, new_left_x:new_right_x, c]
            )

        # **🔹 Merge Original Background to Fix Background Removal**
        no_glasses_mask = (user_image[:, :, 3] == 0)  # Find transparent areas

        # **Fix Shape Mismatch Error**
        if no_glasses_mask.any():  # Ensure mask is not empty
            user_image[no_glasses_mask] = original_background[no_glasses_mask]  # Restore background

        # Convert back to BGR
        final_image = cv2.cvtColor(user_image, cv2.COLOR_BGRA2BGR)
        
        return final_image

    return user_image

def overlay_shirt(user_image, shirt_image, scale_factor=1.4, height_adjust=0.1):
    """Overlay a shirt on a user while preserving original colors."""
    user_image_rgb = cv2.cvtColor(user_image, cv2.COLOR_BGR2RGB)
    results = pose.process(user_image_rgb)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
        
        # Calculate positions
        ih, iw, _ = user_image.shape
        shoulder_distance = (right_shoulder.x - left_shoulder.x) * iw
        new_left_x = (left_shoulder.x * iw) - (shoulder_distance * (scale_factor - 1) / 2)
        new_right_x = (right_shoulder.x * iw) + (shoulder_distance * (scale_factor - 1) / 2)
        
        mid_shoulder = ((left_shoulder.x + right_shoulder.x) / 2, (left_shoulder.y + right_shoulder.y) / 2)
        mid_hip = ((left_hip.x + right_hip.x) / 2, (left_hip.y + right_hip.y) / 2)
        third_point = (mid_shoulder[0], mid_hip[1] + height_adjust)

        src_points = np.array([
            [0, 0],
            [shirt_image.shape[1], 0],
            [shirt_image.shape[1] // 2, shirt_image.shape[0]]
        ], dtype=np.float32)

        dst_points = np.array([
            [new_left_x, left_shoulder.y * ih - (height_adjust * ih)],
            [new_right_x, right_shoulder.y * ih - (height_adjust * ih)],
            [third_point[0] * iw, third_point[1] * ih]
        ], dtype=np.float32)

        # Transform shirt image
        M = cv2.getAffineTransform(src_points, dst_points)
        warped_shirt = cv2.warpAffine(shirt_image, M, (iw, ih), flags=cv2.INTER_LINEAR)

        # Convert warped shirt to grayscale and create a mask
        gray = cv2.cvtColor(warped_shirt, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)

        # Invert mask
        mask_inv = cv2.bitwise_not(mask)

        # Extract regions
        user_bg = cv2.bitwise_and(user_image, user_image, mask=mask_inv)  # Keep user image
        shirt_fg = cv2.bitwise_and(warped_shirt, warped_shirt, mask=mask)  # Keep only shirt

        # Merge images
        result = cv2.add(user_bg, shirt_fg)

        return result

    return user_image

@app.route('/tryon', methods=['POST'])
def try_on():
    """Handle try-on API request."""
    try:
        data = request.get_json()
        if not data or 'userImage' not in data or 'productImage' not in data or 'category' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        user_image = base64_to_image(data['userImage'])
        product_image = base64_to_image(data['productImage'])
        
        if data['category'] == "glasses":
            result_image = overlay_glasses(user_image, product_image)
        elif data['category'] == "men":
            result_image = overlay_shirt(user_image, product_image)
        else:
            return jsonify({'error': 'Invalid category'}), 400

        result_base64 = image_to_base64(result_image)
        return jsonify({'resultImage': result_base64}), 200

    except Exception as e:
        print("Error in /tryon:", e)
        print(traceback.format_exc()) 
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
