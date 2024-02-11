from flask import Flask, request, jsonify
from flask_cors import CORS
import xarray as xr
import numpy as np

app = Flask(__name__)
CORS(app)

dataset = xr.open_dataset('data/waves_2019-01-01.nc')


@app.route('/hmax', methods=['GET'])
def get_hmax():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    time = '2019-01-01'

    hmax = dataset['hmax'].sel(latitude=lat, longitude=lon, method="nearest").sel(time=time).max().values

    return jsonify({'hmax': "no data"} if np.isnan(hmax) else {'hmax': float(hmax)})


if __name__ == '__main__':
    app.run(debug=True)
