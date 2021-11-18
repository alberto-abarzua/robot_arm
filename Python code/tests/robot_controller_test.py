import sys
import os.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import arm_control.commands as com
import unittest
import arm_control.controller as ctrl
import arm_utils.armTransforms as util
from arm_utils.armTransforms import Angle
from arm_utils.armTransforms import Config
import arm_utils.robotarm as robotarm
import numpy as np

__author__ = "Alberto Abarzua"


class robot_controller_tests(unittest.TestCase):

    def angleAllClose(self, L1, L2):
        """Helper method used to check if two Angle list have almost the same values.

        Args:
            L1 (list[Angle]): first list
            L2 (list[Angle]): second list
        Returns:
            bool: if all the angles are close.
        """
        L1 = [angle.rad for angle in L1]
        L2 = [angle.rad for angle in L2]
        return np.allclose(L1, L2, atol=1/self.controller.acc)

    def setUp(self):
        self.controller = ctrl.Controller()
        self.arduino = self.controller.arduino

    def test_arduino_dummy(self):
        self.assertEqual("1", self.controller.read())
        self.assertEqual(12, self.controller.arduino.in_waiting)
        self.assertEqual(
            50, self.controller.arduino.max_value_from_command("m7 0 0 0 0 50 0 0"))
        self.assertEqual(
            150, self.controller.arduino.max_value_from_command("m7 0 150 0 0 50 0 0"))
        self.assertEqual(1000, self.controller.arduino.max_value_from_command(
            "m7 1000 150 0 0 50 0 0"))
        self.assertEqual(1000, self.controller.arduino.max_value_from_command(
            "m7 0 150 0 0 50 0 1000"))

    def test_move_command(self):
        joints = [Angle(np.pi, "rad"), Angle(2*np.pi, "rad"), Angle(np.pi, "rad"),
                  Angle(np.pi, "rad"), Angle(np.pi, "rad"), Angle(np.pi, "rad")]
        m_command = com.MoveCommand(self.controller, joints)
        self.controller.send_command(m_command)
        self.assertEqual(
            "m7 31416 62832 62832 31416 31416 31416 31416\n", self.arduino.received_lines[0])
        self.assertEqual([31416, 62832, 31416, 31416, 31416,
                         31416], self.controller.arduino_angles)
        self.assertTrue(self.angleAllClose(
            joints, self.controller.get_arduino_angles()))
        m_command = com.MoveCommand(self.controller, joints)
        self.controller.send_command(m_command)
        self.assertEqual(
            "m7 31416 62832 62832 31416 31416 31416 31416\n", self.arduino.received_lines[1])
        self.assertEqual([62832, 125664, 62832, 62832, 62832,
                         62832], self.controller.arduino_angles)
        joints = [Angle(angle.rad*2, "rad") for angle in joints]
        self.assertTrue(self.angleAllClose(
            joints, self.controller.get_arduino_angles()))

    def test_move_to_point(self):
        cords = [326, 0, 334]
        euler = [Angle(0, "rad"), Angle(0, "rad"), Angle(0, "rad")]
        # Moving to initial position
        self.controller.move_to_point(Config(cords,euler))
        self.assertTrue("m7 0 0 0 0 0 0 0", self.arduino.received_lines[0])
        self.assertTrue(self.angleAllClose(
            [Angle(0, "rad") for _ in range(6)], self.controller.get_arduino_angles()))

        joints = [Angle(np.pi/8, "rad"), Angle(2*np.pi/8, "rad"), Angle(np.pi/8, "rad"),
                  Angle(np.pi/8, "rad"), Angle(np.pi/8, "rad"), Angle(np.pi/8, "rad")]
        conf = self.controller.robot.direct_kinematics(joints)

        # Moving to initial position
        self.controller.move_to_point(conf)
        self.assertEqual("m7 3927 7854 7854 3927 3927 3927 3927\n",
                         self.arduino.received_lines[1])
        self.assertTrue(self.angleAllClose(
            joints, self.controller.get_arduino_angles()))


if __name__ == '__main__':
    unittest.main()