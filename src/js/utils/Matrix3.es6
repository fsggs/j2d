export default class Matrix3 {
    static projection(width, height) {
        // Note: This matrix flips the Y axis so that 0 is at the top.
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ];
    }

    static identity() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }

    static translation(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    }

    static rotation(angleInRadians) {
        let cos = Math.cos(angleInRadians);
        let sin = Math.sin(angleInRadians);
        return [
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1,
        ];
    }

    static scaling(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    }

    static multiply(a, b) {
        return [
            b[0] * a[0] + b[1] * a[3] + b[2] * a[2 * 3],
            b[0] * a[1] + b[1] * a[3 + 1] + b[2] * a[2 * 3 + 1],
            b[0] * a[2] + b[1] * a[3 + 2] + b[2] * a[2 * 3 + 2],
            b[3] * a[0] + b[3 + 1] * a[3] + b[3 + 2] * a[2 * 3],
            b[3] * a[1] + b[3 + 1] * a[3 + 1] + b[3 + 2] * a[2 * 3 + 1],
            b[3] * a[2] + b[3 + 1] * a[3 + 2] + b[3 + 2] * a[2 * 3 + 2],
            b[2 * 3] * a[0] + b[2 * 3 + 1] * a[3] + b[2 * 3 + 2] * a[2 * 3],
            b[2 * 3] * a[1] + b[2 * 3 + 1] * a[3 + 1] + b[2 * 3 + 2] * a[2 * 3 + 1],
            b[2 * 3] * a[2] + b[2 * 3 + 1] * a[3 + 2] + b[2 * 3 + 2] * a[2 * 3 + 2],
        ];
    }

    static translate(m, tx, ty) {
        return Matrix3.multiply(m, Matrix3.translation(tx, ty));
    }

    static rotate(m, angleInRadians) {
        return Matrix3.multiply(m, Matrix3.rotation(angleInRadians));
    }

    static scale(m, sx, sy) {
        return Matrix3.multiply(m, Matrix3.scaling(sx, sy));
    }

    static centerTo(m, cx, cy) {
        return Matrix3.multiply(m, Matrix3.translation(cx, cy));
    }
};
